import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_webview_plugin/flutter_webview_plugin.dart';
import 'package:substrate_sign_flutter/substrate_sign_flutter.dart';

class Api {
  static final FlutterWebviewPlugin flutterWebviewPlugin = new FlutterWebviewPlugin();
  static final Api _apiInstance = Api._internal();
  Map<String, ValueNotifier> _rpcNotifiers = new Map();
  Map<String, StreamController> _eventSubscribers = new Map();
  Map<String, Completer> _rawTxFutures = new Map();
  Map<String, String> _eventNames = new Map();
  bool loaded = false;
  bool subscribed = false;
  factory Api() {
    return _apiInstance;
  }
  Api._internal();

  Future<void> init() async {
    flutterWebviewPlugin.launch(
      "about:blank",
      hidden: true,
      javascriptChannels: Set.from([
        JavascriptChannel(
            onMessageReceived: (JavascriptMessage message) {
              print('received msg : ${message.message}');
              Map<String, dynamic>rpcEvent = jsonDecode(message.message);
              if(_eventSubscribers.isNotEmpty){
                _eventSubscribers.forEach((key, _subscriber) {
                  final subscribedEvent = _eventNames[key];
                  if(rpcEvent.containsKey(subscribedEvent)){
                    _subscriber.add(rpcEvent[subscribedEvent]);
                  }
                });
              }
            },
            name: "AuthenticationRequestSubs"),
        JavascriptChannel(
            onMessageReceived: (JavascriptMessage message) {
              Map<String, dynamic>rpcCallback = jsonDecode(message.message);
              final String id = rpcCallback['id'];
              final String result = rpcCallback['result'];
              print('received event : $result');
              if (_rpcNotifiers.containsKey(id)){
                _rpcNotifiers[id].value = result;
                _rpcNotifiers.remove(id);
              }
            },
            name: "QuerySubs"),
        JavascriptChannel(
            onMessageReceived: (JavascriptMessage message) {
              if(message.message == '__init__') {
                loaded = true;
                flutterWebviewPlugin.evalJavascript('sub(false)');
              } else {
                print('verbose: ${message.message}');
              }
            },
            name: "Verbose"
        ),
        JavascriptChannel(
            onMessageReceived: (JavascriptMessage message) {
              if(message.message == '__submitted__'){
                print('submit finished');
              }else {
                Map<String, dynamic>txCallback = jsonDecode(message.message);
                String txId = txCallback["id"];
                if(_rawTxFutures.containsKey(txId)){
                  _rawTxFutures[txId].complete(message.message);
                  _rawTxFutures.remove(txId);
                }
              }
            },
            name: 'TxSubs'
        )
      ]),
    );
    var jsCode = await rootBundle.loadString('js/output/main.js');
    flutterWebviewPlugin.onStateChanged.listen((viewState) async {
      if (viewState.type == WebViewState.finishLoad) {
        await flutterWebviewPlugin.evalJavascript(jsCode);
      }
    });
  }

  void registerListener (String id, ValueNotifier valueNotifier) {
    if(loaded == false) return;
    _rpcNotifiers[id]= valueNotifier;
  }

  void unregisterListener (String id) {
    if(loaded == false) return;
    _rpcNotifiers.remove(id);
  }

  void registerEventSubscriber (String id, StreamController streamController, String eventName) {
    if(loaded == false) return;
    _eventSubscribers[id] = streamController;
    _eventNames[id] = eventName;
  }

  void unregisterEventSubscriber (String id ) {
    if(loaded == false) return;
    _eventSubscribers.remove(id);
    _eventNames.remove(id);
  }

  void query(String queryFunction, String queryParams, String queryId) {
    if(loaded == false) return;
    final query = 'query(api.query.$queryFunction, $queryParams, "$queryId")';
    print('query tx is $query');
    flutterWebviewPlugin.evalJavascript('query(api.query.$queryFunction, $queryParams, "$queryId")');
  }

  Future<void> tx (String txFunction, String txParams, String suri, int ss58Format) async {
    if(loaded == false) return;
    final completer = new Completer();
    final txId = UniqueKey().toString();
    _rawTxFutures[txId] = completer;

    Future<String> getRawTx (){
      final address = substrateAddress(suri, ss58Format);
      flutterWebviewPlugin.evalJavascript('window.tx.getRaw(api.tx.$txFunction, $txParams, "$address", "$txId");');
      return completer.future;
    }

    final payload = await getRawTx();
    Map<String, dynamic> txCallback = jsonDecode(payload);
    String payloadHex = txCallback["hex"];
    String signature = substrateSign(suri, payloadHex);
    flutterWebviewPlugin.evalJavascript('window.tx.submit("0x$signature", \'$payload\')');
  }

  Future<String> test () async {
    return await flutterWebviewPlugin.evalJavascript("1+1");
  }
}

