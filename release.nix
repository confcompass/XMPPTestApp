{ nixpkgs ? <nixpkgs>
, systems ? [ "x86_64-linux" "x86_64-darwin" ]
, androidKeyStore ? null # Change this to a keystore file
, androidKeyAlias ? "xmpptestapp"
, androidKeyStorePassword ? "secret"
, iosMobileProvisioningProfile ? null # Change this to a .mobileprovision file
, iosCertificate ? null # Change this to a .p12 file
, iosCertificateName ? "Example" # Should match what is in the p12 file
, iosCertificatePassword ? "" # Should match what is in the p12 file
, enableWirelessDistribution ? false
, installURL ? "/installipa.php"
}:

let
  pkgs = import nixpkgs {};
in
rec {
  XMPPTestApp_android_debug = pkgs.lib.genAttrs systems (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    pkgs.titaniumenv.buildApp {
      name = "XMPPTestApp-android-debug";
      src = ./.;
      target = "android";
      androidPlatformVersions = [ "25" "26" ];
    });

  XMPPTestApp_android_release = pkgs.lib.genAttrs systems (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    pkgs.titaniumenv.buildApp {
      name = "XMPPTestApp-android-release";
      src = ./.;
      target = "android";
      release = true;
      inherit androidKeyStore androidKeyAlias androidKeyStorePassword;
    });

  emulate_XMPPTestApp_debug = pkgs.lib.genAttrs systems (system:
    pkgs.androidenv.emulateApp {
      name = "emulate-XMPPTestApp-debug";
      app = XMPPTestApp_android_debug."${system}";
      platformVersion = "23";
      abiVersion = "x86";
      useGoogleAPIs = false;
      package = "cc.conferences.xmpptestapp";
      activity = ".XmpptestappActivity";
    });

  emulate_XMPPTestApp_release = pkgs.lib.genAttrs systems (system:
    pkgs.androidenv.emulateApp {
      name = "emulate-XMPPTestApp-release";
      app = XMPPTestApp_android_release."${system}";
      platformVersion = "23";
      abiVersion = "x86";
      useGoogleAPIs = false;
      package = "cc.conferences.xmpptestapp";
      activity = ".XmpptestappActivity";
    });

  doc = pkgs.stdenv.mkDerivation {
    name = "XMPPTestApp-doc";
    src = ./.;
    buildInputs = [ pkgs.nodePackages.jsdoc ];
    installPhase = ''
      jsdoc -R README.md -r app/lib -d $out/share/doc/XMPPTestApp/apidox
      mkdir -p $out/nix-support
      echo "doc api $out/share/doc/XMPPTestApp/apidox" >> $out/nix-support/hydra-build-products
    '';
  };

} // (if builtins.elem "x86_64-darwin" systems then rec {
  XMPPTestApp_ipa =
    let
      pkgs = import nixpkgs { system = "x86_64-darwin"; };
    in
    pkgs.titaniumenv.buildApp {
      name = "XMPPTestApp-ipa";
      src = ./.;
      target = "iphone";
      release = true;
      inherit iosMobileProvisioningProfile iosCertificate iosCertificateName iosCertificatePassword;
      inherit enableWirelessDistribution installURL;
    };
  
  XMPPTestApp_ios_development =
    let
      pkgs = import nixpkgs { system = "x86_64-darwin"; };
    in
    pkgs.titaniumenv.buildApp {
      name = "XMPPTestApp-ios-development";
      src = ./.;
      target = "iphone";
    };

  simulate_XMPPTestApp =
    let
      pkgs = import nixpkgs { system = "x86_64-darwin"; };
    in
    pkgs.xcodeenv.simulateApp {
      name = "simulate-XMPPTestApp";
      bundleId = "cc.conferences.xmpptestapp";
      app = "${XMPPTestApp_ios_development}/build/iphone/build/Products/Debug-iphonesimulator";
    };
} else {})
