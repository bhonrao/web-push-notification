self.addEventListener('notificationclose', event => {
    console.log('Notification closed', event);
})

self.addEventListener('notificationclick', event => {
    if (event.action === "search") {
        const githubUser = event.notification.data.githubUser;
        clients.openWindow(`https://github.com/${githubUser}`);
    } else if (event.action === "close") {
        clients.openWindow(`https://www.google.co.in/`);
    } else if (event.action === "") {
        event.waitUntil(
            clients.matchAll().then(cs => {
                const client = cs.find(c => c.visibilityState === "visible")
                if(client !== undefined) {
                    //when tab is open and visible
                    client.navigate(`https://www.google.co.in/`);
                } else {
                    client.openWindow(`https://www.google.co.in/`);
                }
            })
        )
    }

    console.log('Notification clicked', event);

    self.registration.getNotifications()
        .then(ns => ns.forEach(n => n.close()))
})

// self.addEventListener('push', event => {
//     const data = event.data.text();
//     const options = {
//         body: data
//     }

//     event.waitUntil(
//         self.registration.showNotification("Server Push", options)
//     )
// })

self.addEventListener('push', event => {
    const transaction = JSON.parse(event.data.text());
    const options = {
        body: transaction.business
    }
    const transactionType = transaction.type === "deposit" ? '+' : '-';

    event.waitUntil(
        clients.matchAll()
            .then(cs => {
                if (cs.length == 0) {
                    self.registration.showNotification(`${transactionType}` + transaction.amount, options)
                } else {
                    cs[0].postMessage(transaction)
                }
            })
    )
})