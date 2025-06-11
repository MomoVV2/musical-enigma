document.addEventListener('DOMContentLoaded', () => {
	
	if (!('serviceWorker' in navigator)) {
		console.warn('Service workers are not supported by this browser');
		return;
	}
	
	if (!('PushManager' in window)) {
		console.warn('Push notifications are not supported by this browser');
		return;
	}
	
	if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
		console.warn('Notifications are not supported by this browser');
		return;
	}
	
	if (Notification.permission === 'denied') {
		console.warn('Notifications are denied by the user');
	}
	
	if (navigator.serviceWorker.controller) {
		console.log('[PWA Builder] active service worker found, no need to register')
	} else {
		navigator.serviceWorker.register('/pwabuilder-sw.js', {scope: '/'}).then(function(reg) {
			console.log('Service worker has been registered for scope:' + reg.scope);
		});
	}
});
