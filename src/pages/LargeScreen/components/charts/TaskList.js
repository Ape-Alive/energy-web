import React, {Component} from 'react';
import RollingStyle from './TaskList.less';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false,
      listData: [
        {
          id: 1,
          status: '已处理完成',
          address: '龙岩市上杭县桂和村村民委员会东北1124.0米',
          area: '2000㎡',
        },
        {
          id: 2,
          status: '已处理完成',
          address: '龙岩市上杭县蛟潭村村民委员会西南1221.0米',
          area: '830㎡',
        },
        {
          id: 3,
          status: '已处理完成',
          address: '龙岩市新罗区陈二坑东南约382米',
          area: '3363㎡',
        },
        {
          id: 4,
          status: '已处理完成',
          address: '龙岩市连城县百金山东南约626米',
          area: '1381㎡',
        },
        {
          id: 5,
          status: '已处理完成',
          address: '福州市长乐南路55红星新村东北约167米',
          area: '183㎡',
        },
        {
          id: 6,
          status: '已处理完成',
          address: '龙岩市连城县坪坑村西南约992米',
          area: '2262㎡',
        },
      ]
    }
    ;
  }

  // 组件装载完毕
  componentDidMount() {
    setInterval(() => {
      this.ScrollUp(this)
    }, 2000);
  }

  // 组件更新完毕
  componentDidUpdate() {
  }

  ScrollUp(that) {
    const {listData} = that.state;
    that.setState({animate: true});   // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
    setTimeout(() => {      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
      listData.push(listData[0]);  // 将数组的第一个元素添加到数组的
      listData.shift();               // 删除数组的第一个元素
      that.setState({animate: false}); // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      that.forceUpdate();
    }, 1000)
  }


  render() {
    const {listData, animate} = this.state;
    return (
      <div className={RollingStyle.RollingWrap}>
        <div className={RollingStyle.Title}>
          本月违章处理情况
        </div>
        <div className={RollingStyle.RollingNews}>
          <ul className={animate ? RollingStyle.anim : ''}>
            {listData.map((item, index) => (
              <li className={RollingStyle.RollingNewsItem} key={item.id}>
                {item.address}
                <span className={RollingStyle.SpecialText1}>面积: {item.area}</span>
                <span className={RollingStyle.SpecialText2}>{item.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default TaskList;
