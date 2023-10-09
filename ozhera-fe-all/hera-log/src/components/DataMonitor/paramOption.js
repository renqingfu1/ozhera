const paramOption = {
  metricOption: [ // 数据类型下拉选项
    {
      value: 'rocketmq_group_diff',
      label: '消费组延迟数量',
    }, {
      value: 'rocketmq_client_consume_fail_msg_count',
      label: '消费组失败数量',
    }, {
      value: 'rocketmq_consumer_tps',
      label: '消费者TPS',
    }, {
      value: 'rocketmq_producer_tps',
      label: '生产者TPS',
    }, {
      value: 'rocketmq_producer_offset',
      label: '生产者位置',
    },
  ],
  aggreatorOption: [ // 采样方法下拉选项
    'avg', 'sum', 'min', 'max',
  ],
};
export default paramOption;
