import React from 'react';
import { Button, DatePicker } from 'element-react'
import { connect } from 'react-redux'
import logo from './logo.svg';
import { i18n } from 'element-react'
import elEn from 'element-react/src/locale/lang/en'
import elZh from 'element-react/src/locale/lang/zh-CN'
import intl from 'react-intl-universal';
import zh from './i18n/zh/zh.js'
import en from './i18n/en/en.js'
import { addCountAsync, decrease } from './store/actions'
import './App.css';
const locales = {
  "en": en,
  "zh": zh,
};

const mapStateToProps = (state) => {
  return {
    count: state.count
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: () => dispatch(addCountAsync()),
    decrease: () => dispatch(decrease())
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
    }
  }


  // 初始化加载
  UNSAFE_componentWillMount() {
    if (!this.getlocalStorage('lang')) {
      const lang = {
        elLange: elZh,
        intlLange: 'zh'
      }
      this.setlocalStorage('lang', lang)
    }
    this.loadLocales();
    this.loadElLocales();
  }
  // 切换语言
  handle = () => {
    const lang = this.getlocalStorage('lang')
    if (lang.intlLange == 'zh') {
      const lang = {
        elLange: elEn,
        intlLange: 'en'
      }
      this.setlocalStorage('lang', lang)
      this.loadLocales();
      this.loadElLocales();
    } else {
      const lang = {
        elLange: elZh,
        intlLange: 'zh'
      }
      this.setlocalStorage('lang', lang)
      this.loadLocales();
      this.loadElLocales();
    }
  }
  getlocalStorage(key) {
    if (typeof JSON.parse(localStorage.getItem(key)) == 'object') {
      return JSON.parse(localStorage.getItem(key))
    } else {
      return localStorage.getItem(key)
    }


  }

  setlocalStorage(key, value) {
    if (typeof value == 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }


  }

  loadElLocales() {
    const lang = this.getlocalStorage('lang')
    i18n.use(lang.elLange);
  }

  loadLocales() {
    const lang = this.getlocalStorage('lang')
    intl.init({
      currentLocale: lang.intlLange,
      locales,
    })
      .then(() => {
        this.setState({ initDone: true });
      });
  }





  render() {
    const { value1, value2 } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {this.state.initDone &&

            <Button onClick={this.handle} type="primary">
              <p>{intl.get('title')}</p>
              <p>{intl.get('ConfigRedux')}</p>
              <p>{intl.get('configRouter')}</p>
              <p>{intl.get('configReq')}</p>
              <p>{intl.get('i18n')}</p>

            </Button>}
          <DatePicker
            value={value1}
            placeholder="选择日期"
            onChange={date => {
              console.debug('DatePicker1 changed: ', date)
              this.setState({ value1: date })
            }}
            disabledDate={time => time.getTime() < Date.now() - 8.64e7}
          />
          <p>redux示例-{this.props.count}</p>
          <span><Button type="primary" onClick={this.props.add} >+</Button></span>
          <span><Button type="primary" onClick={this.props.decrease}>-</Button></span>


        </header>

      </div>
    );

  }

}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App) 
