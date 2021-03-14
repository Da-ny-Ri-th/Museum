(function(){
    var script = {
 "horizontalAlign": "left",
 "scrollBarVisible": "rollOver",
 "id": "rootPlayer",
 "scrollBarMargin": 2,
 "children": [
  "this.MainViewer",
  "this.Image_BEE6FED8_AC35_2F20_41D8_34B6B91DA709",
  "this.Container_806973DA_ADB0_EB72_41E1_4BBDAAEB91FF",
  "this.Container_BC8D06B7_B143_E72C_41CA_E1C4F81682F0",
  "this.HTMLText_B3A95BF7_AD90_5B11_41E1_AC9050095132",
  "this.Container_A797E343_B17D_3EDA_41AB_2CDE4A57AE7C",
  "this.HTMLText_10D1FFAA_31BC_38BB_41A4_2A0F45EB8484"
 ],
 "buttonToggleFullscreen": "this.IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A",
 "start": "this.init(); this.syncPlaylists([this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist,this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist,this.mainPlayList]); this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist.set('selectedIndex', 0); if(!this.get('fullscreenAvailable')) { [this.IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A].forEach(function(component) { component.set('visible', false); }) }",
 "class": "Player",
 "width": "100%",
 "defaultVRPointer": "laser",
 "scripts": {
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "unregisterKey": function(key){  delete window[key]; },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "registerKey": function(key, value){  window[key] = value; },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getKey": function(key){  return window[key]; },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "existsKey": function(key){  return key in window; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } }
 },
 "contentOpaque": false,
 "downloadEnabled": false,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "verticalAlign": "top",
 "paddingRight": 0,
 "minWidth": 20,
 "layout": "absolute",
 "borderRadius": 0,
 "borderSize": 0,
 "definitions": [{
 "items": [
  {
   "media": "this.panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_camera"
  },
  {
   "media": "this.panorama_200B21CE_31C4_28FB_41BF_E8A09B804172",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_camera"
  },
  {
   "media": "this.panorama_20216505_31C4_2969_4122_39B5AFCA2AC0",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_camera"
  },
  {
   "media": "this.panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_camera"
  },
  {
   "media": "this.panorama_205A4B18_31C5_D967_41C6_99E6474304B8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_205A4B18_31C5_D967_41C6_99E6474304B8_camera"
  },
  {
   "media": "this.panorama_200C103A_31C4_6798_41B1_A14526FEE056",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200C103A_31C4_6798_41B1_A14526FEE056_camera"
  }
 ],
 "id": "ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist",
 "class": "PlayList"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_20191832_31C4_67AB_41B1_939E2E210B00_t.jpg",
 "vfov": 180,
 "label": "02",
 "hfovMin": "120%",
 "id": "panorama_20191832_31C4_67AB_41B1_939E2E210B00",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_camera"
},
{
 "items": [
  {
   "begin": "this.MapViewerMapPlayer.set('movementMode', 'constrained')",
   "media": "this.map_2BCAF024_31CC_27AF_41BD_63BD9E2A62BE",
   "player": "this.MapViewerMapPlayer",
   "class": "MapPlayListItem"
  }
 ],
 "id": "DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist",
 "class": "PlayList"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_200EC483_31C4_2F69_418F_E1138D574644_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_t.jpg",
 "vfov": 180,
 "label": "13",
 "hfovMin": "120%",
 "id": "panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_t.jpg",
 "vfov": 180,
 "label": "\u1785\u17c6\u178e\u178f\u179a\u1790\u1799\u1793\u17d2\u178f\u1780\u17d2\u179a\u17bb\u1784",
 "hfovMin": "120%",
 "id": "panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "items": [
  {
   "media": "this.panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_camera"
  },
  {
   "media": "this.panorama_20191832_31C4_67AB_41B1_939E2E210B00",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20191832_31C4_67AB_41B1_939E2E210B00_camera"
  },
  {
   "media": "this.panorama_200B21CE_31C4_28FB_41BF_E8A09B804172",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_camera"
  },
  {
   "media": "this.panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_camera"
  },
  {
   "media": "this.panorama_20216505_31C4_2969_4122_39B5AFCA2AC0",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_camera"
  },
  {
   "media": "this.panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_camera"
  },
  {
   "media": "this.panorama_205A0891_31C5_E769_41C1_914A6AA637DA",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_205A0891_31C5_E769_41C1_914A6AA637DA_camera"
  },
  {
   "media": "this.panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_camera"
  },
  {
   "media": "this.panorama_205A4B18_31C5_D967_41C6_99E6474304B8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_205A4B18_31C5_D967_41C6_99E6474304B8_camera"
  },
  {
   "media": "this.panorama_200EC483_31C4_2F69_418F_E1138D574644",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200EC483_31C4_2F69_418F_E1138D574644_camera"
  },
  {
   "media": "this.panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_camera"
  },
  {
   "media": "this.panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_camera"
  },
  {
   "media": "this.panorama_200C103A_31C4_6798_41B1_A14526FEE056",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200C103A_31C4_6798_41B1_A14526FEE056_camera"
  },
  {
   "media": "this.panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_camera"
  },
  {
   "media": "this.panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_camera"
  },
  {
   "media": "this.panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_camera"
  },
  {
   "media": "this.panorama_2021D564_31C4_29AF_41BD_5274F2767734",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2021D564_31C4_29AF_41BD_5274F2767734_camera"
  },
  {
   "media": "this.panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_camera"
  },
  {
   "media": "this.album_296504ED_31C4_28B9_41AA_416E967D8667",
   "end": "this.trigger('tourEnded')",
   "class": "PhotoAlbumPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 0)",
   "player": "this.MainViewerPhotoAlbumPlayer"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "easing": "linear",
 "from": "right",
 "id": "effect_F2103674_E554_F572_41B1_203ED4CE50E6",
 "duration": 0,
 "class": "SlideInEffect"
},
{
 "initialZoomFactor": 1,
 "fieldOfViewOverlayOutsideColor": "#000000",
 "fieldOfViewOverlayInsideOpacity": 0.4,
 "label": "Master Plan",
 "scaleMode": "fit_inside",
 "id": "map_2BCAF024_31CC_27AF_41BD_63BD9E2A62BE",
 "thumbnailUrl": "media/map_2BCAF024_31CC_27AF_41BD_63BD9E2A62BE_t.png",
 "height": 4242,
 "width": 6087,
 "fieldOfViewOverlayInsideColor": "#FFFFFF",
 "fieldOfViewOverlayOutsideOpacity": 0,
 "class": "Map",
 "fieldOfViewOverlayRadiusScale": 0.3,
 "image": {
  "levels": [
   {
    "url": "media/map_2BCAF024_31CC_27AF_41BD_63BD9E2A62BE.png",
    "width": 3200,
    "class": "ImageResourceLevel",
    "height": 2230
   },
   {
    "url": "media/map_2BCAF024_31CC_27AF_41BD_63BD9E2A62BE_lq.png",
    "width": 306,
    "tags": "preload",
    "class": "ImageResourceLevel",
    "height": 214
   }
  ],
  "class": "ImageResource"
 },
 "maximumZoomFactor": 1.2,
 "minimumZoomFactor": 0.5
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_200EC483_31C4_2F69_418F_E1138D574644_t.jpg",
 "vfov": 180,
 "label": "11",
 "hfovMin": "120%",
 "id": "panorama_200EC483_31C4_2F69_418F_E1138D574644",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_camera"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0_t.jpg",
 "vfov": 180,
 "label": "12",
 "hfovMin": "120%",
 "id": "panorama_200A2DCB_31C4_38F9_41AC_4D7C5AE701C0",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "displayMovements": [
  {
   "easing": "linear",
   "duration": 1000,
   "class": "TargetRotationalCameraDisplayMovement"
  },
  {
   "easing": "cubic_in_out",
   "targetPitch": 0,
   "targetStereographicFactor": 0,
   "duration": 3000,
   "class": "TargetRotationalCameraDisplayMovement"
  }
 ],
 "id": "panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_camera",
 "displayOriginPosition": {
  "stereographicFactor": 1,
  "hfov": 165,
  "yaw": 0,
  "class": "RotationalCameraDisplayPosition",
  "pitch": -90
 }
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_2021D564_31C4_29AF_41BD_5274F2767734_t.jpg",
 "vfov": 180,
 "label": "18",
 "hfovMin": "120%",
 "id": "panorama_2021D564_31C4_29AF_41BD_5274F2767734",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "easing": "linear",
 "id": "effect_2745FDF7_ACED_1161_41D1_B5EC4D857875",
 "duration": 0,
 "class": "SlideOutEffect",
 "to": "right"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_t.jpg",
 "vfov": 180,
 "label": "19",
 "hfovMin": "120%",
 "id": "panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "buttonMoveUp": "this.IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB",
 "buttonMoveRight": "this.IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE",
 "displayPlaybackBar": true,
 "buttonZoomOut": "this.IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "buttonPlayRight": "this.IconButton_A7979343_B17D_3EDA_41BB_92702E290118",
 "viewerArea": "this.MainViewer",
 "buttonPlayLeft": "this.IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF",
 "class": "PanoramaPlayer",
 "buttonZoomIn": "this.IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525",
 "buttonPause": "this.IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonMoveDown": "this.IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96",
 "buttonMoveLeft": "this.IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935",
 "mouseControlMode": "drag_acceleration"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_t.jpg",
 "vfov": 180,
 "label": "05",
 "hfovMin": "120%",
 "id": "panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "thumbnailUrl": "media/album_296504ED_31C4_28B9_41AA_416E967D8667_t.png",
 "id": "album_296504ED_31C4_28B9_41AA_416E967D8667",
 "label": "Photo Album Cover 01",
 "class": "PhotoAlbum",
 "playList": "this.album_296504ED_31C4_28B9_41AA_416E967D8667_AlbumPlayList"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_camera"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_205A0891_31C5_E769_41C1_914A6AA637DA_camera"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_205CBEA0_31C4_38A7_41C1_219FD8E7CFA2_camera"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_2021D564_31C4_29AF_41BD_5274F2767734_camera"
},
{
 "easing": "linear",
 "from": "right",
 "id": "effect_2745EDF7_ACED_1161_41CE_8D7449621D35",
 "duration": 0,
 "class": "SlideInEffect"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_200C103A_31C4_6798_41B1_A14526FEE056_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_200B21CE_31C4_28FB_41BF_E8A09B804172_t.jpg",
 "vfov": 180,
 "label": "\u1785\u17c6\u178e\u178f\u179a\u1790\u1799\u1793\u17d2\u178f",
 "hfovMin": "120%",
 "id": "panorama_200B21CE_31C4_28FB_41BF_E8A09B804172",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_200C103A_31C4_6798_41B1_A14526FEE056_t.jpg",
 "vfov": 180,
 "label": "\u1785\u17c6\u178e\u178f\u179f\u17c6\u179a\u17b6\u1794\u17cb\u1787\u1793\u1796\u17b7\u1780\u17b6\u179a",
 "hfovMin": "120%",
 "id": "panorama_200C103A_31C4_6798_41B1_A14526FEE056",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_t.jpg",
 "vfov": 180,
 "label": "\u1785\u17c6\u178e\u178f\u179f\u17c6\u179a\u17b6\u1794\u17cb\u1787\u1793\u1796\u17b7\u1780\u17b6\u179a",
 "hfovMin": "120%",
 "id": "panorama_20216505_31C4_2969_4122_39B5AFCA2AC0",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36_t.jpg",
 "vfov": 180,
 "label": "07",
 "hfovMin": "120%",
 "id": "panorama_20066F3A_31C5_D99B_41C4_DEAA1DCFFA36",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_205EE1FA_31C5_E89B_419E_56F4C4CD6AD3_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9_t.jpg",
 "vfov": 180,
 "label": "15",
 "hfovMin": "120%",
 "id": "panorama_20009952_31C4_79EB_41B9_5046E9D8C3E9",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "thumbnailUrl": "media/album_296504ED_31C4_28B9_41AA_416E967D8667_0_t.jpg",
 "label": "Cover 01",
 "id": "album_296504ED_31C4_28B9_41AA_416E967D8667_0",
 "height": 1905,
 "width": 3387,
 "image": {
  "levels": [
   {
    "url": "media/album_296504ED_31C4_28B9_41AA_416E967D8667_0.jpg",
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "duration": 5000,
 "class": "Photo"
},
{
 "buttonZoomOut": "this.IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
 "viewerArea": "this.MapViewer",
 "class": "MapPlayer",
 "buttonZoomIn": "this.IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525",
 "movementMode": "constrained",
 "id": "MapViewerMapPlayer"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_20216505_31C4_2969_4122_39B5AFCA2AC0_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E_t.jpg",
 "vfov": 180,
 "label": "17",
 "hfovMin": "120%",
 "id": "panorama_200CBC1C_31C4_5F9F_41A5_274A5D14FE8E",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_205A4B18_31C5_D967_41C6_99E6474304B8_camera"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_23F46B9C_31C4_389F_41C5_1DAF8290B227_camera"
},
{
 "easing": "linear",
 "id": "effect_F210C674_E554_F572_41E1_4BD5DFC260E8",
 "duration": 0,
 "class": "SlideOutEffect",
 "to": "right"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_205A4B18_31C5_D967_41C6_99E6474304B8_t.jpg",
 "vfov": 180,
 "label": "\u1785\u17c6\u178e\u178f\u1798\u17c9\u17bc\u178f\u17bc",
 "hfovMin": "120%",
 "id": "panorama_205A4B18_31C5_D967_41C6_99E6474304B8",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_205A0891_31C5_E769_41C1_914A6AA637DA_t.jpg",
 "vfov": 180,
 "label": "08",
 "hfovMin": "120%",
 "id": "panorama_205A0891_31C5_E769_41C1_914A6AA637DA",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D_t.jpg",
 "vfov": 180,
 "label": "16",
 "hfovMin": "120%",
 "id": "panorama_200142D4_31C4_68EF_41B9_4F280BB62A4D",
 "class": "Panorama",
 "hfovMax": 130,
 "hfov": 360,
 "pitch": 0,
 "partial": false
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_2045070C_31C4_297F_41C8_EA9B6110D4B0_camera"
},
{
 "automaticRotationSpeed": 12,
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "id": "panorama_20191832_31C4_67AB_41B1_939E2E210B00_camera"
},
{
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/f/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/f/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/f/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/f/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_t.jpg",
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/b/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/b/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/b/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/b/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/d/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/d/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/d/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/d/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/l/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/l/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/l/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/l/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/u/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/u/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/u/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/u/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/r/0/{row}_{column}.jpg",
      "colCount": 6,
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "tags": "ondemand",
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/r/1/{row}_{column}.jpg",
      "colCount": 3,
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "tags": "ondemand",
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/r/2/{row}_{column}.jpg",
      "colCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "tags": "ondemand",
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0/r/3/{row}_{column}.jpg",
      "colCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "tags": [
       "ondemand",
       "preload"
      ],
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   }
  }
 ],
 "thumbnailUrl": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_t.jpg",
 "label": "\u1785\u17d2\u179a\u1780\u1785\u17bc\u179b\u17a2\u1782\u17b6\u179a",
 "hfovMin": "120%",
 "id": "panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4",
 "class": "Panorama",
 "overlays": [
  "this.overlay_2211A505_3210_FA37_4142_B4E59BC09C6C",
  "this.overlay_2306E243_3210_7E33_41B8_4ACC9EC08708"
 ],
 "partial": false,
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_200EC483_31C4_2F69_418F_E1138D574644"
  }
 ],
 "hfov": 360,
 "pitch": 0,
 "vfov": 180,
 "hfovMax": 130
},
{
 "viewerArea": "this.MainViewer",
 "buttonPause": "this.IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
 "id": "MainViewerPhotoAlbumPlayer",
 "class": "PhotoAlbumPlayer"
},
{
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeight": 10,
 "toolTipFontSize": "0.6vw",
 "id": "MainViewer",
 "left": 0,
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipTextShadowColor": "#000000",
 "class": "ViewerArea",
 "width": "100%",
 "toolTipFontWeight": "normal",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 50,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 0,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "toolTipFontStyle": "normal",
 "minWidth": 100,
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipFontFamily": "Arial",
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressOpacity": 1,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "top": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingTop": 0,
 "progressBarBorderColor": "#000000",
 "paddingBottom": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#000000",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Main Viewer"
 },
 "shadow": false,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 1
},
{
 "horizontalAlign": "center",
 "maxHeight": 85,
 "maxWidth": 214,
 "id": "Image_BEE6FED8_AC35_2F20_41D8_34B6B91DA709",
 "left": "3%",
 "class": "Image",
 "right": "91.27%",
 "url": "skin/Image_BEE6FED8_AC35_2F20_41D8_34B6B91DA709.png",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "bottom": "4%",
 "top": "86.71%",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "propagateClick": false,
 "paddingBottom": 0,
 "scaleMode": "fit_inside",
 "data": {
  "name": "DD"
 },
 "paddingLeft": 0,
 "shadow": false
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_F59EA3FC_AC15_152A_41D3_A68AE3523ABE",
  "this.Container_8F88A174_B17F_DAF3_41E3_9385916D5A3E",
  "this.Container_8E56560D_B147_6613_41E3_B9F30B1AF2C2"
 ],
 "id": "Container_806973DA_ADB0_EB72_41E1_4BBDAAEB91FF",
 "left": "79.38%",
 "scrollBarMargin": 2,
 "class": "Container",
 "right": "1.2%",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "0%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Right Side Container"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "children": [
  "this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856"
 ],
 "id": "Container_BC8D06B7_B143_E72C_41CA_E1C4F81682F0",
 "left": "0%",
 "scrollBarMargin": 2,
 "class": "Container",
 "right": "84.23%",
 "layout": "absolute",
 "contentOpaque": false,
 "minHeight": 1,
 "verticalAlign": "top",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "0%",
 "bottom": "0%",
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Left Side Container"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "id": "HTMLText_B3A95BF7_AD90_5B11_41E1_AC9050095132",
 "left": "0.05%",
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "right": "49.95%",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "5.79%",
 "bottom": "83.89%",
 "borderSize": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "paddingBottom": 20,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vw;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#003366;font-size:1.21vw;font-family:'Khmer Old Style';\"><B><I>\u1793\u17b7\u1780\u17d2\u1781\u17c1\u1794\u1794\u1791\u1786\u17d2\u1793\u17b6\u17c6 \u17e2\u17e0\u17e2\u17e0</I></B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText53815"
 },
 "scrollBarOpacity": 0.5,
 "paddingLeft": 20,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
  "this.IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF",
  "this.IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935",
  "this.Container_A7977343_B17D_3EDA_41C0_F47328C07981",
  "this.IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE",
  "this.IconButton_A7979343_B17D_3EDA_41BB_92702E290118",
  "this.IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A",
  "this.IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525"
 ],
 "id": "Container_A797E343_B17D_3EDA_41AB_2CDE4A57AE7C",
 "left": "40%",
 "scrollBarMargin": 2,
 "class": "Container",
 "right": "38.77%",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 20,
 "verticalAlign": "middle",
 "scrollBarWidth": 10,
 "paddingRight": 0,
 "top": "85.03%",
 "backgroundOpacity": 0,
 "minWidth": 20,
 "borderRadius": 0,
 "bottom": "0%",
 "borderSize": 0,
 "gap": 4,
 "paddingTop": 0,
 "propagateClick": false,
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Middle Control"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "hidden",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "id": "HTMLText_10D1FFAA_31BC_38BB_41A4_2A0F45EB8484",
 "left": "0.05%",
 "scrollBarMargin": 2,
 "class": "HTMLText",
 "right": "0%",
 "minHeight": 1,
 "scrollBarWidth": 10,
 "paddingRight": 20,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "top": "0%",
 "borderSize": 0,
 "paddingTop": 20,
 "propagateClick": false,
 "height": 147.37,
 "paddingBottom": 20,
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vw;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#333333;font-size:1.99vw;font-family:'Khmer Kolab';\"><B>\u179f\u17b6\u179a\u1798\u1793\u17d2\u1791\u17b8\u179a\u179f\u17b6\u1798\u17bb\u1785\u17d2\u1785\u17d0\u1799\u1794\u17d2\u179a\u179c\u178f\u17d2\u178f\u17b7\u179f\u17b6\u179f\u17d2\u178f\u17d2\u179a \u17a2\u1793\u17d2\u179b\u1784\u17cb\u200b\u200b\u200b\u179c\u17c2\u1784</B></SPAN></SPAN></DIV></div>",
 "scrollBarColor": "#000000",
 "data": {
  "name": "HTMLText53815"
 },
 "scrollBarOpacity": 0.5,
 "paddingLeft": 20,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "horizontalAlign": "center",
 "maxHeight": 128,
 "maxWidth": 128,
 "id": "IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A",
 "toolTipTextShadowColor": "#000000",
 "width": "15.34%",
 "toolTipFontSize": 12,
 "class": "IconButton",
 "toolTipFontWeight": "normal",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "toolTipShadowColor": "#333333",
 "minHeight": 1,
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "toolTipPaddingLeft": 6,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "toggle",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "toolTipFontStyle": "normal",
 "toolTipShadowOpacity": 1,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A_rollover.png",
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "iconURL": "skin/IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A.png",
 "paddingBottom": 0,
 "toolTip": "Fullscreen",
 "transparencyActive": true,
 "toolTipFontFamily": "Arial",
 "toolTipShadowSpread": 0,
 "toolTipShadowHorizontalLength": 0,
 "data": {
  "name": "IconButton1493"
 },
 "toolTipBorderColor": "#767676",
 "height": "27.74%",
 "toolTipShadowVerticalLength": 0,
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 1,
 "pressedIconURL": "skin/IconButton_BD225E9E_B273_D96C_41A9_C0F962709F6A_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB",
 "width": "80%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "data": {
  "name": "Button27667"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE",
 "width": "8.96%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "data": {
  "name": "Button27670"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A797A343_B17D_3EDA_41B1_10FF9F1B46EE_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE",
 "width": "9.07%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "data": {
  "name": "Button27662"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A7973343_B17D_3EDA_41E5_A3FC6227C5CE_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7979343_B17D_3EDA_41BB_92702E290118",
 "width": "11.17%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "pressedRollOverIconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118_pressed_rollover.png",
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "29.2%",
 "data": {
  "name": "Button27671"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A7979343_B17D_3EDA_41BB_92702E290118_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF",
 "width": "11.27%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "29.2%",
 "data": {
  "name": "Button27664"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A7971343_B17D_3EDA_41E1_D4B648D50BFF_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525",
 "width": "8.91%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "data": {
  "name": "Button27673"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A797F343_B17D_3EDA_41E1_5446CB5EC525_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
 "width": "100%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "toggle",
 "borderRadius": 0,
 "borderSize": 0,
 "pressedRollOverIconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61_pressed_rollover.png",
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "29.2%",
 "data": {
  "name": "Button27668"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96",
 "width": "80%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "data": {
  "name": "Button27669"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96_pressed.png"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935",
 "width": "8.99%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935.png",
 "paddingBottom": 0,
 "transparencyActive": false,
 "height": "23.36%",
 "data": {
  "name": "Button27665"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_A7970343_B17D_3EDA_41DF_8CEDA653A935_pressed.png"
},
{
 "items": [
  {
   "media": "this.album_296504ED_31C4_28B9_41AA_416E967D8667_0",
   "camera": {
    "initialPosition": {
     "x": "0.50",
     "zoomFactor": 1,
     "class": "PhotoCameraPosition",
     "y": "0.50"
    },
    "class": "MovementPhotoCamera",
    "easing": "linear",
    "scaleMode": "fit_outside",
    "duration": 5000,
    "targetPosition": {
     "x": "0.51",
     "zoomFactor": 1.1,
     "class": "PhotoCameraPosition",
     "y": "0.56"
    }
   },
   "class": "PhotoPlayListItem"
  }
 ],
 "id": "album_296504ED_31C4_28B9_41AA_416E967D8667_AlbumPlayList",
 "class": "PhotoPlayList"
},
{
 "playbackBarHeadShadowVerticalLength": 0,
 "playbackBarHeight": 10,
 "toolTipFontSize": "1.11vmin",
 "id": "MapViewer",
 "toolTipTextShadowColor": "#000000",
 "playbackBarBackgroundColorDirection": "vertical",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "class": "ViewerArea",
 "width": "100%",
 "toolTipFontWeight": "normal",
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "progressBarBorderSize": 0,
 "toolTipShadowColor": "#333333",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "minHeight": 1,
 "playbackBarBorderRadius": 0,
 "transitionDuration": 500,
 "paddingRight": 0,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderRadius": 0,
 "height": "90%",
 "toolTipFontStyle": "normal",
 "minWidth": 1,
 "borderSize": 0,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipShadowOpacity": 1,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipFontFamily": "Arial",
 "playbackBarBorderSize": 0,
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "paddingLeft": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "progressOpacity": 1,
 "progressBottom": 2,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
 "displayTooltipInTouchScreens": true,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "transitionMode": "blending",
 "progressBarOpacity": 1,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderSize": 1,
 "toolTipPaddingRight": 6,
 "progressBorderSize": 0,
 "toolTipPaddingLeft": 6,
 "toolTipPaddingTop": 4,
 "toolTipDisplayTime": 600,
 "progressBorderRadius": 0,
 "progressBackgroundColorRatios": [
  0
 ],
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarLeft": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "playbackBarHeadHeight": 15,
 "paddingTop": 0,
 "progressBarBorderColor": "#000000",
 "paddingBottom": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBackgroundColorDirection": "vertical",
 "toolTipShadowSpread": 0,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "toolTipBorderColor": "#767676",
 "progressBorderColor": "#000000",
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Floor Plan"
 },
 "shadow": false,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipShadowBlurRadius": 3,
 "toolTipOpacity": 1
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0_HS_1_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -6.33,
   "hfov": 14.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.21
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 9)",
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_20E0D33D_3213_FE57_41C3_C648831332A8",
   "yaw": -6.33,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -5.21,
   "hfov": 14.17,
   "distance": 100
  }
 ],
 "id": "overlay_2211A505_3210_FA37_4142_B4E59BC09C6C",
 "data": {
  "label": "Circle 03b"
 }
},
{
 "enabledInCardboard": true,
 "maps": [
  {
   "image": {
    "levels": [
     {
      "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0_HS_2_0_0_map.gif",
      "width": 61,
      "class": "ImageResourceLevel",
      "height": 16
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -179.67,
   "hfov": 11.17,
   "class": "HotspotPanoramaOverlayMap",
   "pitch": -5.09
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000"
  }
 ],
 "useHandCursor": true,
 "items": [
  {
   "image": "this.AnimatedImageResource_23638E2B_3211_E673_41C1_B39457313265",
   "yaw": -179.67,
   "class": "HotspotPanoramaOverlayImage",
   "pitch": -5.09,
   "hfov": 11.17,
   "distance": 100
  }
 ],
 "id": "overlay_2306E243_3210_7E33_41B8_4ACC9EC08708",
 "data": {
  "label": "Circle 03b"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_FDD61685_E553_9592_41C0_A2A83A363C32"
 ],
 "id": "Container_F59EA3FC_AC15_152A_41D3_A68AE3523ABE",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "vertical",
 "contentOpaque": true,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "borderColor": "#000000",
 "paddingRight": 0,
 "verticalAlign": "middle",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 50,
 "borderSize": 2,
 "gap": 15,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "69.727%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Floor Plan Container"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9"
 ],
 "id": "Container_8F88A174_B17F_DAF3_41E3_9385916D5A3E",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "19.78%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Middle"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_8886944C_AC33_7318_41AB_EB089F4691B5"
 ],
 "id": "Container_8E56560D_B147_6613_41E3_B9F30B1AF2C2",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 10,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "5.25%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Bottom"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "left",
 "id": "ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856",
 "left": "10%",
 "itemLabelFontFamily": "Arial",
 "class": "ThumbnailList",
 "right": "25%",
 "itemBorderRadius": 0,
 "itemHorizontalAlign": "center",
 "minHeight": 20,
 "verticalAlign": "top",
 "itemLabelPosition": "bottom",
 "itemPaddingLeft": 3,
 "paddingRight": 20,
 "itemThumbnailBorderRadius": 50,
 "playList": "this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856_playlist",
 "backgroundOpacity": 0,
 "minWidth": 20,
 "borderSize": 0,
 "itemBackgroundOpacity": 0,
 "itemThumbnailShadowSpread": 1,
 "propagateClick": false,
 "itemBackgroundColor": [],
 "itemPaddingTop": 3,
 "itemThumbnailShadowVerticalLength": 3,
 "itemBackgroundColorRatios": [],
 "itemThumbnailShadowHorizontalLength": 3,
 "rollOverItemBackgroundOpacity": 0,
 "itemThumbnailOpacity": 1,
 "itemVerticalAlign": "middle",
 "rollOverItemLabelFontWeight": "normal",
 "paddingLeft": 20,
 "selectedItemLabelFontSize": "0.72vw",
 "layout": "vertical",
 "scrollBarMargin": 2,
 "itemThumbnailHeight": 60,
 "itemThumbnailShadowOpacity": 0.54,
 "itemLabelTextDecoration": "none",
 "itemLabelFontWeight": "normal",
 "itemThumbnailShadowBlurRadius": 8,
 "itemPaddingRight": 3,
 "itemThumbnailScaleMode": "fit_outside",
 "itemLabelFontSize": "0.84vw",
 "selectedItemLabelFontColor": "#FFCC00",
 "scrollBarWidth": 10,
 "itemOpacity": 1,
 "bottom": "10%",
 "borderRadius": 5,
 "top": "12%",
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontColor": "#FFFFFF",
 "gap": 5,
 "paddingTop": 10,
 "itemThumbnailShadow": true,
 "paddingBottom": 10,
 "selectedItemLabelFontWeight": "bold",
 "scrollBarColor": "#FFFFFF",
 "rollOverItemLabelFontSize": "0.78vw",
 "itemPaddingBottom": 3,
 "itemLabelGap": 9,
 "itemThumbnailShadowColor": "#000000",
 "itemLabelFontStyle": "normal",
 "scrollBarOpacity": 0.5,
 "itemLabelHorizontalAlign": "center",
 "data": {
  "name": "ThumbnailList35762"
 },
 "scrollBarVisible": "rollOver",
 "shadow": false,
 "itemMode": "normal"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_A7975343_B17D_3EDA_41BF_8955CDC2EDAB",
  "this.IconButton_A7974343_B17D_3EDA_41D5_38B6E5F68E61",
  "this.IconButton_A797B343_B17D_3EDA_41CA_0171986F3D96"
 ],
 "id": "Container_A7977343_B17D_3EDA_41C0_F47328C07981",
 "scrollBarMargin": 2,
 "width": "11.36%",
 "class": "Container",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 20,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 20,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 4,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Container27666"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "hidden",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0_HS_1_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_20E0D33D_3213_FE57_41C3_C648831332A8",
 "rowCount": 6
},
{
 "colCount": 4,
 "frameCount": 24,
 "class": "AnimatedImageResource",
 "frameDuration": 41,
 "levels": [
  {
   "url": "media/panorama_22F1BEE4_31C4_78AF_4190_51CF5B92C8B4_0_HS_2_0.png",
   "width": 1080,
   "class": "ImageResourceLevel",
   "height": 420
  }
 ],
 "id": "AnimatedImageResource_23638E2B_3211_E673_41C1_B39457313265",
 "rowCount": 6
},
{
 "horizontalAlign": "center",
 "children": [
  "this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990",
  "this.MapViewer"
 ],
 "id": "Container_FDD61685_E553_9592_41C0_A2A83A363C32",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "vertical",
 "contentOpaque": true,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "borderColor": "#000000",
 "paddingRight": 0,
 "verticalAlign": "middle",
 "backgroundOpacity": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 50,
 "borderSize": 2,
 "gap": 15,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "80%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Floor Plan Con 01"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E",
  "this.Container_23BF7E02_AC1D_72AA_41DA_22E1695AF185"
 ],
 "id": "Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 3,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Contact Us Compo"
 },
 "scrollBarOpacity": 0.5,
 "visible": false,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829",
  "this.Button_B5551DB1_A8AE_1192_41E0_9815EC3E8FD9",
  "this.Button_BAFF9AB7_AC6D_3778_41DD_EF9D1C21D15E"
 ],
 "id": "Container_8886944C_AC33_7318_41AB_EB089F4691B5",
 "scrollBarMargin": 2,
 "width": "100%",
 "class": "Container",
 "layout": "horizontal",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 5,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Button CU and FP"
 },
 "scrollBarOpacity": 0,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "arrowColor": "#FFFFFF",
 "popUpShadowBlurRadius": 6,
 "pressedBackgroundColorRatios": [
  0
 ],
 "fontColor": "#FFFFFF",
 "id": "DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990",
 "pressedBackgroundColor": [
  "#003366"
 ],
 "width": "100%",
 "popUpBorderRadius": 0,
 "fontFamily": "Arial",
 "class": "DropDown",
 "rollOverBackgroundColor": [
  "#003366"
 ],
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#003366",
 "popUpShadowColor": "#000000",
 "popUpShadowOpacity": 0,
 "pressedRollOverBackgroundColorRatios": [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
 ],
 "minHeight": 20,
 "rollOverPopUpFontColor": "#FFFFFF",
 "popUpGap": 0,
 "selectedPopUpBackgroundColor": "#003366",
 "borderColor": "#FFFFFF",
 "rollOverBackgroundColorRatios": [
  0
 ],
 "paddingRight": 15,
 "backgroundColor": [
  "#000000"
 ],
 "playList": "this.DropDown_EAAD8681_E54D_95D1_41D7_9D484A259990_playlist",
 "backgroundOpacity": 0.2,
 "minWidth": 200,
 "borderRadius": 4,
 "borderSize": 2,
 "fontSize": "1vw",
 "popUpShadowSpread": 1,
 "gap": 0,
 "popUpBackgroundOpacity": 0.2,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "8%",
 "paddingBottom": 0,
 "popUpShadow": false,
 "fontStyle": "normal",
 "backgroundColorRatios": [
  0
 ],
 "popUpFontColor": "#000000",
 "data": {
  "name": "DropDown1204"
 },
 "selectedPopUpFontColor": "#FFFFFF",
 "textDecoration": "none",
 "pressedRollOverBackgroundColor": [
  "#003366",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#003366"
 ],
 "paddingLeft": 15,
 "shadow": false,
 "popUpBackgroundColor": "#FFFFFF",
 "fontWeight": "bold",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 616,
 "maxWidth": 900,
 "id": "IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E",
 "width": "81.529%",
 "class": "IconButton",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E.png",
 "paddingBottom": 0,
 "click": "if(!this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9.get('visible')){ this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, false, 0, null, null, false) }",
 "transparencyActive": false,
 "height": "100%",
 "data": {
  "name": "Contact"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_217F3EB5_ACF5_33E4_41E2_608DADB8CC7E_pressed.png"
},
{
 "horizontalAlign": "center",
 "children": [
  "this.IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48",
  "this.IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2",
  "this.IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300"
 ],
 "id": "Container_23BF7E02_AC1D_72AA_41DA_22E1695AF185",
 "scrollBarMargin": 2,
 "width": "20%",
 "class": "Container",
 "layout": "vertical",
 "contentOpaque": false,
 "minHeight": 1,
 "scrollBarWidth": 10,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "borderRadius": 0,
 "borderSize": 0,
 "gap": 12,
 "paddingTop": 0,
 "propagateClick": false,
 "height": "100%",
 "paddingBottom": 0,
 "scrollBarColor": "#000000",
 "data": {
  "name": "Left Contact Us"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "scroll",
 "paddingLeft": 0,
 "shadow": false,
 "scrollBarVisible": "rollOver"
},
{
 "horizontalAlign": "center",
 "id": "IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829",
 "width": "13%",
 "class": "IconButton",
 "minHeight": 0,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 0,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "pressedRollOverIconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829_pressed_rollover.png",
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829.png",
 "paddingBottom": 0,
 "click": "if(!this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856.get('visible')){ this.setComponentVisibility(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856, true, 0, null, null, false) } else { this.setComponentVisibility(this.ThumbnailList_B7480756_AD90_6B13_41A9_86B89E4AD856, false, 0, null, null, false) }",
 "transparencyActive": false,
 "data": {
  "name": "Button27669"
 },
 "height": "100%",
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_91D696C6_B1C5_2631_41D0_5016C4C73829_pressed.png"
},
{
 "horizontalAlign": "center",
 "click": "if(!this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9.get('visible')){ this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, true, 0, this.effect_2745EDF7_ACED_1161_41CE_8D7449621D35, 'showEffect', false) } else { this.setComponentVisibility(this.Container_26D3DDC5_AC15_11AC_41E2_6BB5E3BD07D9, false, 0, this.effect_2745FDF7_ACED_1161_41D1_B5EC4D857875, 'hideEffect', false) }",
 "fontColor": "#FFFFFF",
 "id": "Button_B5551DB1_A8AE_1192_41E0_9815EC3E8FD9",
 "pressedRollOverBackgroundColor": [
  "#003366"
 ],
 "pressedBackgroundColor": [
  "#003366"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "44.1%",
 "shadowColor": "#000000",
 "fontFamily": "Montserrat",
 "class": "Button",
 "iconHeight": 0,
 "height": "85.65%",
 "pressedFontSize": "1vw",
 "rollOverShadow": false,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "pressedRollOverBackgroundColorRatios": [
  0
 ],
 "minHeight": 1,
 "rollOverBackgroundOpacity": 0.8,
 "borderColor": "#FFFFFF",
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "verticalAlign": "middle",
 "backgroundOpacity": 0.15,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 5,
 "borderSize": 2,
 "shadowSpread": 1,
 "rollOverBackgroundColor": [
  "#003366"
 ],
 "paddingTop": 0,
 "propagateClick": false,
 "fontSize": "1vw",
 "paddingBottom": 0,
 "label": "CONTACT US",
 "fontStyle": "normal",
 "backgroundColorRatios": [
  0
 ],
 "gap": 15,
 "layout": "horizontal",
 "pressedBackgroundColorRatios": [
  0
 ],
 "data": {
  "name": "Button Contact Info info"
 },
 "textDecoration": "none",
 "iconWidth": 0,
 "iconBeforeLabel": true,
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "fontWeight": "bold",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "click": "if(!this.Container_FDD61685_E553_9592_41C0_A2A83A363C32.get('visible')){ this.setComponentVisibility(this.Container_FDD61685_E553_9592_41C0_A2A83A363C32, true, 0, this.effect_F2103674_E554_F572_41B1_203ED4CE50E6, 'showEffect', false) } else { this.setComponentVisibility(this.Container_FDD61685_E553_9592_41C0_A2A83A363C32, false, 0, this.effect_F210C674_E554_F572_41E1_4BD5DFC260E8, 'hideEffect', false) }",
 "fontColor": "#FFFFFF",
 "id": "Button_BAFF9AB7_AC6D_3778_41DD_EF9D1C21D15E",
 "pressedBackgroundColor": [
  "#003366"
 ],
 "pressedBackgroundOpacity": 1,
 "width": "44.1%",
 "shadowColor": "#000000",
 "fontFamily": "Montserrat",
 "class": "Button",
 "iconHeight": 0,
 "height": "85.65%",
 "rollOverBackgroundOpacity": 0.8,
 "rollOverShadow": false,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "shadowBlurRadius": 15,
 "minHeight": 1,
 "rollOverBackgroundColor": [
  "#003366"
 ],
 "borderColor": "#FFFFFF",
 "paddingRight": 0,
 "backgroundColor": [
  "#000000"
 ],
 "verticalAlign": "middle",
 "backgroundOpacity": 0.15,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 5,
 "borderSize": 2,
 "shadowSpread": 1,
 "pressedBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "propagateClick": false,
 "fontSize": "1vw",
 "paddingBottom": 0,
 "label": "FLOOR PLAN",
 "fontStyle": "normal",
 "backgroundColorRatios": [
  0
 ],
 "gap": 5,
 "layout": "horizontal",
 "data": {
  "name": "Button Floor Plan"
 },
 "textDecoration": "none",
 "iconWidth": 0,
 "iconBeforeLabel": true,
 "paddingLeft": 0,
 "shadow": false,
 "pressedRollOverFontSize": "1vw",
 "cursor": "hand",
 "fontWeight": "bold",
 "backgroundColorDirection": "vertical"
},
{
 "horizontalAlign": "center",
 "maxHeight": 50,
 "maxWidth": 50,
 "id": "IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48",
 "width": "100%",
 "class": "IconButton",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "pressedRollOverIconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48_pressed_rollover.png",
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48.png",
 "paddingBottom": 0,
 "click": "this.openLink('https://www.pinterest.com/dany_rith/_created/', '_blank')",
 "transparencyActive": false,
 "height": "25%",
 "data": {
  "name": "Website"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_D5B1805E_AC13_0F42_41D2_CC3FD0439B48_pressed.png"
},
{
 "horizontalAlign": "center",
 "maxHeight": 50,
 "maxWidth": 50,
 "id": "IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2",
 "width": "100%",
 "class": "IconButton",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "transparencyActive": false,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2.png",
 "paddingBottom": 0,
 "height": "25%",
 "data": {
  "name": "Map"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_D64C3B69_AC13_714E_41C2_32E6C6ABE2F2_pressed.png"
},
{
 "horizontalAlign": "center",
 "maxHeight": 50,
 "maxWidth": 50,
 "id": "IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300",
 "width": "100%",
 "class": "IconButton",
 "minHeight": 1,
 "verticalAlign": "middle",
 "paddingRight": 0,
 "backgroundOpacity": 0,
 "minWidth": 1,
 "mode": "push",
 "borderRadius": 0,
 "borderSize": 0,
 "paddingTop": 0,
 "rollOverIconURL": "skin/IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300_rollover.png",
 "propagateClick": false,
 "iconURL": "skin/IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300.png",
 "paddingBottom": 0,
 "click": "this.openLink('https://www.linkedin.com/in/dany-rith-06549017a/', '_blank')",
 "transparencyActive": false,
 "height": "25%",
 "data": {
  "name": "Linkin"
 },
 "paddingLeft": 0,
 "shadow": false,
 "cursor": "hand",
 "pressedIconURL": "skin/IconButton_DEE538D8_AC15_3F47_41B7_DF462598A300_pressed.png"
}],
 "desktopMipmappingEnabled": false,
 "paddingTop": 0,
 "propagateClick": false,
 "mobileMipmappingEnabled": false,
 "paddingBottom": 0,
 "gap": 10,
 "backgroundPreloadEnabled": true,
 "scrollBarColor": "#000000",
 "height": "100%",
 "mouseWheelEnabled": true,
 "vrPolyfillScale": 0.5,
 "data": {
  "name": "Player3105"
 },
 "scrollBarOpacity": 0.5,
 "overflow": "visible",
 "paddingLeft": 0,
 "shadow": false
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
