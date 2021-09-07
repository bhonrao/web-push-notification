const webpush = require('web-push');
const faker = require('faker');



const pushSubscription = {    
    endpoint: "https://fcm.googleapis.com/fcm/send/dRw4sJHc5H8:APA91bGnmi6nUJH9z1Y_czG874LZxSe2WWXZqyFz61Lwf8AA-vGZezJRoj0GRT_x_vBeVazjoH_OVTtdWAxuobaxqmbxVZxRNNNSozHG-P-q_3XHIEcl6dWI9ktB9EfTF9kEwuB_x4qN",
expirationTime: null,
keys: {p256dh: "BEvIPEBlXmrfwoysmaimRQsKgzDVdErxiXQaMKeTIX0kkMRtwqtsmz0-34D0_XD6lZ-0WK1slOMZN-sWlbA-2J8", auth: "Gty_faAaELEoN9T04bdBmQ"}

}


const vapidPublicKey = 'BDce3pG-QSkXjYSatlQpJsQu4kvCzurDn9tZGQKzI6ZSS9Hd4xpXTGkwfSCu32rA6D8CPjQEgbjdJAmk28IxXGc';
const vapidPrivateKey = '2XUcMnAwXy2fFB7-ZwEvgp7Nx7EGqojeYaN9j1d_t0M';

const options = {
    TTL: 60,
    vapidDetails: {
        subject: 'mailto:example@yourdomain.org',
        publicKey: vapidPublicKey,
        privateKey: vapidPrivateKey
    }
};

// const notify = () => {
//     const transaction = faker.helpers.createTransaction()

//    webpush.sendNotification(
//        pushSubscription,
//        JSON.stringify(transaction),
//        options
//    )
//    .then(() => console.log(`subscribers Notified`))
//    .catch(error => console.error('Error in pushing notification', error))
// }

// const notify = (subscribers) => {
//     const transaction = faker.helpers.createTransaction()

//     if(subscribers.size < 1) {
//         console.log("No Subscriber to notify");
//         return;
//     }
//     subscribers.forEach((subscriber, id) => {
//         webpush.sendNotification(
//             subscriber,
//             JSON.stringify(transaction),
//             options
//         )
//         .then(() => console.log(`${subscribers.size} subscribers Notified`))
//         .catch(error => console.error('Error in pushing notification', error))
//     })  
// }


const notify = () => {
    webpush.sendNotification(
        pushSubscription,
        "hello from server",
        options
    )
    .then(() => console.log(`subscribers Notified`))
    .catch(error => console.error('Error in pushing notification', error))
}

module.exports = {
    notify: notify
}
