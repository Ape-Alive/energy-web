import React, { Component } from 'react';
import RollingStyle from './NewsList.less';

class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animate: false,
      listData: [
        {
          id: 1,
          date: '2015-1-21',
          title: '福州市人民政府办公厅关于印发《福州市“两违”认定标准及分类处置意见》的通知',
          link: 'http://www.fuzhou.gov.cn/zfxxgkzl/dflf/gfxwj/gfxwjk/201506/t20150610_1691000.htm',
        },
        {
          id: 2,
          date: '2017-1-22',
          title: '福建省人民政府办公厅关于深化“两违”综合治理专项行动的意见',
          link: 'http://www.fujian.gov.cn/zc/zxwj/szfbgtwj/201701/t20170124_1180158.htm',
        },
        {
          id: 3,
          date: '2017-11-30',
          title: '《福建省违法建设处置若干规定》出台',
          link:
            'http://zjt.fujian.gov.cn/ztzl/fjslwzhzlzxxd/zcwj_2918/201711/t20171130_2901083.htm?from=singlemessage',
        },
        {
          id: 4,
          date: '2017-04-20',
          title: '没有侥幸，没有姑息，“两违”行为零容忍——我省重拳治违决心不动摇',
          link: 'https://mp.weixin.qq.com/s/_vfSLJII9edxtmV6eIKlHA?',
        },
        {
          id: 5,
          date: '2017-4-21',
          title: '全国违法建设专项治理和历史文化街区划定、 历史图斑确定工作推进会在福州召开',
          link: 'https://mp.weixin.qq.com/s/rE-vZ3BTXigS6lVKw6zwlw?',
        },
        {
          id: 6,
          date: '2017-3-30',
          title: '全省“两违”综合治理现场会在福州召开 副省长洪捷序出席并讲话',
          link: 'https://mp.weixin.qq.com/s/rwusFi_BucbjF3g-4QuFWw?',
        },
        {
          id: 7,
          date: '2017-3-23',
          title: '攻坚克难 善作善成——全省“两违”综合治理三年专项行动巡礼',
          link: 'https://mp.weixin.qq.com/s/5C28dUfhC5xsz4CovPlwVw?',
        },
      ],
    };
  }

  // 组件装载完毕
  componentDidMount() {
    setInterval(() => {
      this.ScrollUp(this);
    }, 2000);
  }

  // 组件更新完毕
  componentDidUpdate() {}

  ScrollUp(that) {
    const { listData } = that.state;
    that.setState({ animate: true }); // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
    setTimeout(() => {
      //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
      listData.push(listData[0]); // 将数组的第一个元素添加到数组的
      listData.shift(); // 删除数组的第一个元素
      that.setState({ animate: false }); // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      that.forceUpdate();
    }, 1000);
  }

  render() {
    const { listData, animate } = this.state;
    return (
      <div className={RollingStyle.RollingWrap}>
        <div className={RollingStyle.Title}>政策新闻</div>
        <div className={RollingStyle.RollingNews}>
          <ul className={animate ? RollingStyle.anim : ''}>
            {listData.map((item, index) => (
              <li className={RollingStyle.RollingNewsItem} key={item.id}>
                {item.title}
                <a target="_blank" href={item.link}>
                  <span className={RollingStyle.SpecialText1}>访问详情</span>
                </a>
                <span className={RollingStyle.SpecialText2}>{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default NewsList;
