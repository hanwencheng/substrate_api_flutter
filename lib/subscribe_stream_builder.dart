import 'dart:async';

import 'package:flutter/material.dart';
import 'api.dart';

typedef Widget BuilderFunction(BuildContext context, AsyncSnapshot<Map<String, dynamic>> snapshot);

class ApiSubscribeValue extends StatefulWidget {
  final BuilderFunction builder;
  final String eventName;

  ApiSubscribeValue({
    @required this.builder,
    @required this.eventName,
  }):super(key:UniqueKey());

  @override
  _ApiSubscribeValueState createState() => _ApiSubscribeValueState();
}

class _ApiSubscribeValueState extends State<ApiSubscribeValue> {
  final _api = Api();
  final StreamController<Map<String, dynamic>> _streamController = StreamController();
  @override
  void initState() {
    super.initState();
    final String widgetKey = widget.key.toString();
    _api.registerEventSubscriber(widgetKey, _streamController, widget.eventName);
  }

  @override
  void dispose() {
    super.dispose();
    final String widgetKey = widget.key.toString();
    _api.unregisterEventSubscriber(widgetKey);
    _streamController.close();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text('Api return result is'),
        StreamBuilder(
          builder: widget.builder,
          stream: _streamController.stream,
        )
      ],
    );
  }
}
