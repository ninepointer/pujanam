const MandirPost = require('../../models/MandirPost/mandirPost');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const ApiResponse = require('../../helpers/apiResponse'); // Assuming ApiResponse class is saved in utils folder
const {ObjectId} = require('mongodb')
const PostUserInteraction = require('../../models/PostUserInteraction/postUserInteraction');

let clients = [];
console.log('clients init', clients);
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION

});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

exports.resizePhoto = (req, res, next) => {
    console.log(req.file)
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }
    sharp(req.file.buffer).resize({ width: 1080, height: 1920 }).toBuffer()
        .then((resizedImageBuffer) => {
            req.file.buffer = resizedImageBuffer;
            // console.log("Resized:",resizedImageBuffer)
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Error resizing photo" });
        });
};

const processUpload = async (uploadedFiles, s3, route) => {
    const MAX_LIMIT = 10 * 1024 * 1024;
    const fileUploadPromises = uploadedFiles.map(async (file) => {

        if (file.size > MAX_LIMIT) {
            return res.status(500).send({ status: "error", err: error, message: 'Image size should be less then 5 MB.' });
        }
        const key = `MandirPost/${route}/photos/${(Date.now()) + file.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        const uploadedObject = await s3.upload(uploadParams).promise();
        return {
            name: file.originalname,
            url: uploadedObject.Location,
        };
    });

    return fileUploadPromises;
}
// Create a Pandit
exports.createMandirPost = async (req, res) => {
   console.log(req.body)
    try {
        const {
            mandir,
            videoUrl,
            status,
        } = req.body;

        const image = req.file;
        const photo = image && await Promise.all(await processUpload([image], s3, true));

        const mandirPost = await MandirPost.create({
            mandir,
            videoUrl,
            photo: photo[0],
            status,
            created_by:req.user._id, // Assuming the ID of the creator is passed in the request body
            last_modified_by:req.user._id // This might be the same as 'created_by' initially
        });

        ApiResponse.created(res, mandirPost, 'Mandir Post created successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
// Get all Pandits
exports.getAllMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find().populate('allowedReactions').populate('mandir', 'name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
exports.getActiveMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find({status:'Active'}).populate('allowedReactions').populate('mandir', 'name')
        // .populate('language', 'language_name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getInactiveMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find({status:'Inactive'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

exports.getDraftMandirPosts = async (req, res) => {
    try {
        const mandirPost = await MandirPost.find({status:'Draft'})
        // .populate('language', 'language_name');
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Get a Pandit by ID
exports.getMandirPostById = async (req, res) => {
    try {
        const mandirPost = await MandirPost.findById(req.params.id).populate('allowedReactions');
        if (!mandirPost) {
            return ApiResponse.notFound(res, 'Mandir Post not found');
        }
        ApiResponse.success(res, mandirPost);
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};

// Edit a Pandit
 // This holds the connections
exports.editMandirPost = async (req, res) => {
    try {
        const {id} = req.params;
        const update = req.body;
        const updateMandirPost = await MandirPost.findById(req.params.id);
        const image = req.file;

        if (!updateMandirPost) {
            return ApiResponse.notFound(res, 'Post not found');
        }
        let photo;

        if (image) {
            photo = await Promise.all(await processUpload([image], s3, update.route));
            update.photo = photo[0];
        }

        update.last_modified_by = req?.user?._id;
        update.last_modified_on = new Date();
        
        const mandirPostUpdate = await MandirPost.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})
        ApiResponse.success(res, mandirPostUpdate, 'Mandir Post updated successfully');
    } catch (error) {
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};
 
// Edit a Pandit additional_information


exports.addReaction = async(req,res) => {
    const{postId, reactionId} = req.params;
    //update the reaction count in the post
    try {
        // Find the post by ID
        const post = await MandirPost.findById(postId);
    
        if (!post) {
            return ApiResponse.notFound(res, 'Mandir Post not found');
        }
    
        // Check if the reaction already exists in the reactionCount
        const reactionIndex = post.reactionCount.findIndex(r => r.reaction.toString() === reactionId);
    
        if (reactionIndex > -1) {
          // If the reaction exists, increment the count
          post.reactionCount[reactionIndex].count += 1;
        } else {
          // If the reaction does not exist, add it to the array
          post.reactionCount.push({ reaction: reactionId, count: 1 });
        }
    
        // Save the updated post
        await post.save();

        const userReaction  = PostUserInteraction.create({
            interaction_type:'Reaction',
            mandir_post:postId,
            user: req.user._id,
            reaction:reactionId,
            created_by:req.user._id,
            lastModified_by:req.user._id
        });
        console.log('clients here', clients);
        broadcastReactionUpdate(postId);
        ApiResponse.success(res, post, null, 'Added Reaction');
    
      } catch (error) {
        console.error('Error adding reaction:', error);
        ApiResponse.error(res,'Something went wrong', 500, error.message);
      }
    //add a user interactiom

    //return the mandir post

}


exports.getReactionCounts = async (req, res) => {
    const { postId } = req.params; // Assuming postId is passed as a URL parameter

    try {
        const post = await MandirPost.findById(postId);
        if (!post) {
            return res.status(404).send('Post not found');
        }

        // Mapping to simplify the reaction counts data
        const reactionCounts = post.reactionCount.map(r => ({
            reaction: r.reaction,
            count: r.count
        }));

        ApiResponse.success(res, reactionCounts, null, 'Reaction counts fetched');
    } catch (error) {
        console.error('Error getting reaction counts:', error);
        ApiResponse.error(res,'Something went wrong', 500, error.message);
    }
};


// Middleware to inject headers for SSE
exports.setupSSE = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Pings to keep the connection alive
    const pingInterval = setInterval(() => {
        res.write(':\n\n');
        console.log(clients);
    }, 30000);

    // Cleanup on close
    req.on('close', () => {
        console.log('clearing');
        clearInterval(pingInterval);
        clients = clients.filter(client => client !== res);
    });

    next();
}

// SSE endpoint
exports.sendReactionUpdates = (req, res, next) => {
    const { postId } = req.params;

    // Function to send data to a client
    const sendData = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Add this response to the list of clients
    clients.push({ postId, res: sendData });
    console.log(clients, clients[0].res);

    // Send initial data
    sendData({ message: 'Connected to reaction updates' });
    next();
};

// Function to broadcast updates to all clients interested in a specific postId
function broadcastReactionUpdate(postId) {
    console.log('clients', clients);
    const postClients = clients.filter(client => client.postId.toString() === postId.toString());
    console.log(postClients, clients);
    postClients.forEach(client => {
        // Fetch the latest reaction counts for the post
        MandirPost.findById(postId).then(post => {
            if (post) {
                const reactionCounts = post.reactionCount.map(r => ({
                    reaction: r.reaction,
                    count: r.count
                }));
                client.res(reactionCounts);
            }
        }).catch(err => console.error('Error fetching post for broadcast:', err));
    });
}

