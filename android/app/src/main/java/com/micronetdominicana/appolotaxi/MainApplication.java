package com.micronetdominicana.appolotaxi;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new KCKeepAwakePackage(),
        new RNCWebViewPackage(),
        new RNFusedLocationPackage(),
        new RNSoundPackage(),
        new NetInfoPackage(),
        new PickerPackage(),
        new RNGeocoderPackage(),
        new MapsPackage(),
        new RNGestureHandlerPackage(),
        new RNFirebasePackage(),
        new RNFirebaseMessagingPackage(),
        new RNFirebaseAuthPackage(),
        new RNFirebaseNotificationsPackage(),
        new RNFirebaseDatabasePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
