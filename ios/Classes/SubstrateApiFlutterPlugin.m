#import "SubstrateApiFlutterPlugin.h"
#if __has_include(<substrate_api_flutter/substrate_api_flutter-Swift.h>)
#import <substrate_api_flutter/substrate_api_flutter-Swift.h>
#else
// Support project import fallback if the generated compatibility header
// is not copied when this plugin is created as a library.
// https://forums.swift.org/t/swift-static-libraries-dont-copy-generated-objective-c-header/19816
#import "substrate_api_flutter-Swift.h"
#endif

@implementation SubstrateApiFlutterPlugin
+ (void)registerWithRegistrar:(NSObject<FlutterPluginRegistrar>*)registrar {
  [SwiftSubstrateApiFlutterPlugin registerWithRegistrar:registrar];
}
@end
