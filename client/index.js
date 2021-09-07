const client = (() => {
    let serviceWorkerRegObj = undefined;
    const notificationButton = document.getElementById("btn-notify");
    const pushButton = document.getElementById("btn-push");
    const pushNotification = document.getElementById("push-notification");
    let isUserSubscribed = false;

    const showNotificationButton = () => {
        notificationButton.style.display = "block";
        notificationButton.addEventListener("click", showNotification);
    }

    const notifyInApp = (transaction) => {
        const html = `<div>
        <div>Amount : <b> ${transaction.amount}</b></div>
        <div>Business : <b> ${transaction.business}</b></div>
        <div>Name : <b> ${transaction.name}</b></div>
        <div>Type : <b> ${transaction.type}</b></div>
        <div>Account : <b> ${transaction.account}</b></div>
        </div>
        `
        pushNotification.style.display = "flex"
        pushNotification.innerHTML = html
    }
    let count = 0
    const showNotification = () => {
        const simpleTextNotification = reg => reg.showNotification("My First Notification")

        const customizedNotification = reg => {
            const options = {
                body: "this is an important",
                icon: "imgs/images.png",
                tag: "group-1",
                actions: [
                    { action: "search", title: "Try Searching!" },
                    { action: "close", title: "Forget It!" },
                ],
                data: {
                    notificationTime: Date.now(),
                    githubUser: "Bhagyashri"
                }
            }
            reg.showNotification('Second Notification - ' + count++, options)
        }
        navigator.serviceWorker.getRegistration()
            .then(registration => customizedNotification(registration));
    }

    const checkNotificationSupport = () => {
        if (!('Notification' in window)) {
            return Promise.reject("Doesnt Support Notifications.")
        }
        console.log("The Browser Support Notification")
        return Promise.resolve("Ok!")
    }

    const registerServiceWorker = () => {
        if (!('serviceWorker') in navigator) {
            return Promise.reject("ServiceWorker support is not available.")
        }
        return navigator.serviceWorker.register('service-worker.js')
            .then(regObj => {
                console.log("service worker is register successfully");
                serviceWorkerRegObj = regObj;
                showNotificationButton();

                serviceWorkerRegObj.pushManager.getSubscription()
                    .then(subs => {
                        if (subs) disablePushNotificationButton()
                        else enablePushNotificationButton()
                    })

                navigator.serviceWorker.addEventListener('message', e => notifyInApp(e.data))
            })
    }

    const requestNotificaionPermission = () => {
        return Notification.requestPermission(status => {
            console.log("Notification Permission Status:", status)
        })
    }


    checkNotificationSupport()
        .then(registerServiceWorker)
        .then(requestNotificaionPermission)
        .catch(err => console.error(err))

    const disablePushNotificationButton = () => {
        isUserSubscribed = true
        pushButton.innerText = "DISABLE PUSH NOTIFICATION"
        pushButton.style.backgroundColor = '#ea9085'
    }

    const enablePushNotificationButton = () => {
        isUserSubscribed = false
        pushButton.innerText = "ENABLE PUSH NOTIFICATION"
        pushButton.style.backgroundColor = '#efb1ff'
    }

    const setupPush = () => {

        function urlB64ToUint8Array(url) {
            const padding = '='.repeat((4 - url.length % 4) % 4);
            const base64 = (url + padding)
                .replace(/\-/g, '+')
                .replace(/\_/g, '/');

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; i++) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }

        const subscribeWithServer = (subscription) => {
            return fetch('http://localhost:3000/addSubscriber', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'content-Type': 'application/json'
                }
            })
        }

        const subscribeUser = () => {
            const appServerPublicKey = "BPnbH5yOILpbcyhiwumW4Xgj7mjLyxOEbdRSlgvUtQz43QyU4wGoVEMAPh3wYyIJO6uf5mTK-zQCnGSn7NTfPQQ";
            const publichKeyAsArray = urlB64ToUint8Array(appServerPublicKey)

            serviceWorkerRegObj.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publichKeyAsArray
            })
                .then(subscription => {
                    console.log(JSON.stringify(subscription, null, 4))
                    subscribeWithServer(subscription)
                    disablePushNotificationButton();
                })
                .catch(error => console.error("failed to subscribe to push Service", error))
        }

        const unsubscribeWithServer = (id) => {
            return fetch('http://localhost:3000/removeSubscriber', {
                method: 'POST',
                body: JSON.stringify({ id }),
                headers: {
                    'content-Type': 'application/json'
                }
            })
        }

        const unSubscribeUser = () => {
            console.log("unsubscribing user")
            serviceWorkerRegObj.pushManager.getSubscription()
                .then(subscription => {
                    if (subscription) {
                        let subAsString = JSON.stringify(subscription)
                        let subAsObject = JSON.stringify(subAsString)
                        unsubscribeWithServer((![undefined, null].includes(subAsObject.keys) && ![undefined, null].includes(subAsObject.keys.auth))? subAsObject.keys.auth : 0)
                        return subscription.unsubscribe()
                    }
                })
                .then(enablePushNotificationButton())
                .catch(error => console.error("failed to unsubscribe to push service", error))
        }
        pushButton.addEventListener('click', () => {
            if (isUserSubscribed) unSubscribeUser();
            else subscribeUser();
        })
    }

    setupPush()
})()