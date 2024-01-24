const admin = require('firebase-admin');

const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('ascii'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();
exports.sendIndividualNotification = async (title, body, token, mediaUrl = null, actions = null) => {
  const message = {
      notification: {
        title: title,
        body: body,
      },
      token: token
  };
  
  // Add mediaUrl and actions if they are provided
  if (mediaUrl || actions) {
      message.data = {};
      if (mediaUrl) {
          console.log('This is the image url', mediaUrl);  
          message.data.mediaUrl = mediaUrl;
          message.notification.image = mediaUrl;
      }
      if (actions) {
          message.data.actions = JSON.stringify(actions);
      }
  }

  try {
      console.log('sending this', message);  
      const res = await messaging.send(message);
      console.log('Successfully sent message:', res);
      return res;
  } catch (e) {
      console.log('Error sending message:', e);    
  }  
};

exports.sendMultiNotifications = async (title, body, tokens, mediaUrl = null, actions = null) => {
  const message = {
      notification: {
        title: title,
        body: body,
      },
      tokens: tokens
  };
  
  // Add mediaUrl and actions if they are provided
  if (mediaUrl || actions) {
      message.data = {};
      if (mediaUrl) {
          message.data.mediaUrl = mediaUrl;
          message.data.image = mediaUrl;
          message.notification.image = mediaUrl;
        //   message.notification.image = 'https://t4.ftcdn.net/jpg/02/57/42/55/360_F_257425552_3JqnRkyhqjiQcB95Ty2vBH9YMcErSpDM.jpg'
      }
      if (actions) {
          message.data.actions = JSON.stringify(actions);
      }
  }

  try {
      // console.log('sending this', message);  
      const res = await messaging.sendEachForMulticast(message);
      console.log('Successfully sent message');
      return res;
  } catch (e) {
      console.log('Error sending message:', e);    
  }  
};

exports.verifyFirebaseLoginToken = async (req, res) => {
  const { idToken } = req.body;

  try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;
      let user;
      // Find or create the user in your database
      const userObj = {
          uid,
          email: decodedToken.email,
          full_name: decodedToken.name,
          joining_date: new Date(),
          role: new ObjectId('659fdac630fa1324fb3d2688'),
          creation_process: 'Auto SignUp',
          status: 'Active'
          // ... any other user fields
      }
      if (decodedToken?.picture) {
          userObj.profile_picture = { url: decodedToken?.picture, name: decodedToken?.picture };
      }
      if (decodedToken?.phone_number) {
          userObj.mobile = decodedToken.phone_number.replace(/^\+91/, '');
      }
      if (await UserDetail.findOne({ email: decodedToken?.email })) {
          user = await UserDetail.findOneAndUpdate({ email: decodedToken?.email }, userObj, { new: true, upsert: true });
          const token = jwt.sign({ _id: user?._id }, process.env.SECRET_KEY);
          return res.status(200).json({ status: 'success', message: "User login successful", token: token });
      }
      if (await UserDetail.findOne({ mobile: decodedToken?.phone_number })) {
          user = await UserDetail.findOneAndUpdate({ email: decodedToken?.email }, userObj, { new: true, upsert: true });
          const token = jwt.sign({ _id: user?._id }, process.env.SECRET_KEY);
          return res.status(200).json({ status: 'success', message: "User login successful", token: token });
      }
      user = await UserDetail.findOneAndUpdate({ uid }, userObj, { new: true, upsert: true });

      // Create a JWT token
      const token = jwt.sign({ _id: user?._id }, process.env.SECRET_KEY);
      return res.status(200).json({ status: 'success', message: "User login successful", token: token });
  } catch (error) {
      console.log(error);
      res.status(500).json({ status: 'error', message: `Something went wrong. Please try again.` });
  }
};


