import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:substrate_api_flutter/substrate_api_flutter.dart';

void main() {
  const MethodChannel channel = MethodChannel('substrate_api_flutter');

  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    channel.setMockMethodCallHandler((MethodCall methodCall) async {
      return '42';
    });
  });

  tearDown(() {
    channel.setMockMethodCallHandler(null);
  });

  test('getPlatformVersion', () async {
    expect(await SubstrateApiFlutter.platformVersion, '42');
  });
}
