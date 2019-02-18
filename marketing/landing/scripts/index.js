function getMobileOperatingSystem() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	// Windows Phone must come first because its UA also contains 'Android'
	if (/windows phone/i.test(userAgent)) {
		return 'Windows Phone';
	}

	if (/android/i.test(userAgent)) {
		return 'Android';
	}

	// iOS detection from: http://stackoverflow.com/a/9039885/177710
	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return 'iOS';
	}

	return 'unknown';
  }

  function redirectDownload() {
		if (getMobileOperatingSystem() === 'Android') {
			redirectToGooglePlay();
		} else {
			redirectToAppStore();
		}
  }

  function redirectToAppStore() {
	window.location.href = 'https://itunes.apple.com/app/id1453301936';
  }

  function redirectToGooglePlay() {
	window.location.href = 'https://play.google.com/store/apps/details?id=app.cronch.cronch';
  }
