const createGoogleCalenderCredentials = () => {
    const fs = require('fs');
    // Define the data you want to store in the JSON file
    const jsonData = {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url:
            process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN
    };

    // Convert the data to a JSON string
    const jsonString = JSON.stringify(jsonData, null, 2); // The second argument (null) is for replacer function, and the third argument (2) is for indentation.

    // Specify the file name and path
    const filePath = 'credentials.json';

    // Write the JSON data to the file
    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error('Error writing Credentials JSON file:', err);
        } else {
            console.log('Google Crendentials file created successfully!');
        }
    });
};

module.exports = {
    createGoogleCalenderCredentials,
    keyFilename: process.env.CREDENTIALS_PATH
};
