import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'api.dart';

typedef Widget BuilderFunction(BuildContext context, String value, Widget child);

class ApiListenedValue extends StatefulWidget {
  final BuilderFunction builder;
  final String queryFunction;
  final String params;
  final String initValue;

  ApiListenedValue({
    @required this.builder,
    @required this.queryFunction,
    this.params,
    this.initValue,
    }):super(key:UniqueKey());

  @override
  _ApiListenedValueState createState() => _ApiListenedValueState();
}

class _ApiListenedValueState extends State<ApiListenedValue> {
  final ValueNotifier<String> apiResult = ValueNotifier<String>('');
  final _api = Api();

  @override
  void initState() {
    super.initState();
    final String queryId = widget.key.toString();
    print('query id is $queryId');
    if(widget.initValue != null)
      apiResult.value = widget.initValue;
    _api.registerListener(queryId, apiResult);
    _api.query(widget.queryFunction, widget.params??'[]', queryId);
  }

  @override
  void dispose() {
    super.dispose();
    _api.unregisterListener(widget.key.toString());

  }
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: <Widget>[
        Text('Api return result is'),
        ValueListenableBuilder(
          builder: widget.builder,
          valueListenable: apiResult,
        )
      ],
    );
  }
}
