import axios from 'axios';

export default async function getInfo(){
    const ipData = await axios.get('https://geolocation-db.com/json/');
    const ip = ipData?.data?.IPv4;
    const country = ipData?.data?.country_name;
    const isMobile = /Mobi/.test(navigator.userAgent);
    return {ip, country, isMobile};
}

