export const BASIC_OPTION = {
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove'
  },
  series: [
    {
      type: 'tree',

      data: [],

      top: '1%',
      left: '100',
      bottom: '1%',
      right: '100',

      symbolSize: 7,
      initialTreeDepth: 2,

      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 12,
        borderColor: 'green'
      },

      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left'
        }
      },

      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750
    }
  ]
}
