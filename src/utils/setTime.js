import moment from 'moment'
const setTime = (form, timeGroupType, getData) => {
  form &&
    form.current &&
    form.current.validateFields().then((values) => {
      const { dateTimeRange } = values
      let _dateTimeRange = dateTimeRange
      if (timeGroupType === 'yesterday') {
        _dateTimeRange = [
          moment().subtract(1, 'days').startOf('day'),
          moment().subtract(1, 'days').endOf('day')
        ]
      } else if (timeGroupType === 'toDay') {
        _dateTimeRange = [moment().startOf('day'), moment()]
      } else if (timeGroupType === 'threeDay') {
        _dateTimeRange = [moment().subtract(2, 'days').startOf('day'), moment()]
      } else if (timeGroupType === 'oneWeek') {
        _dateTimeRange = [moment().subtract(6, 'days').startOf('day'), moment()]
      } else if (timeGroupType === 'oneMonth') {
        _dateTimeRange = [
          moment()
            .month(moment().month() - 1)
            .startOf('month')
            .valueOf(),
          moment()
            .month(moment().month() - 1)
            .endOf('month')
            .valueOf()
        ]
      } else if (timeGroupType === 'thisMonth') {
        _dateTimeRange = [moment().startOf('month'), moment().valueOf()]
      } else if (timeGroupType === 'oneDay') {
        _dateTimeRange = [moment().subtract(1, 'days').startOf('day'), moment()]
      } else if (timeGroupType === 'twoDay') {
        _dateTimeRange = [moment().subtract(2, 'days').startOf('day'), moment()]
      } else if (timeGroupType === 'oneMonth') {
        _dateTimeRange = [
          moment().subtract(1, 'months').startOf('day'),
          moment()
        ]
      }

      getData({ ...values, dateTimeRange: _dateTimeRange })
    })
}

export default setTime
