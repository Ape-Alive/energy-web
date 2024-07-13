import TweenOne from 'rc-tween-one'
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin'
import React, { Component } from 'react'
import styles from './NumericalAnimation'

TweenOne.plugins.push(Children)

interface props {
  numerical?: number | string // 数值
  floatLength?: number // 保留的小数个数
  className?: string // 数值样式
}
interface state {
  animation: any
}
class NumericalAnimation extends Component<props, state> {
  constructor(props) {
    super(props)
    this.state = {
      animation: null
    }
  }
  componentDidMount() {
    const { numerical, floatLength } = this.props
    this.setAnimation(numerical, floatLength)
  }
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.numerical !== this.props.numerical) {
      this.setAnimation(nextProps.numerical, nextProps.floatLength)
    }
  }

  // 动画渲染
  setAnimation = (numerical, floatLength) => {
    let value = 0
    if (numerical) {
      value = typeof numerical === 'number' ? numerical : Number(numerical)
    }
    this.setState({
      animation: {
        Children: {
          value,
          floatLength
        },
        duration: 1000
      }
    })
  }
  render() {
    const { className } = this.props
    return (
      <div className={styles.numerical_animation}>
        <TweenOne
          animation={this.state.animation}
          className={className}
        ></TweenOne>
      </div>
    )
  }
}
export default NumericalAnimation
