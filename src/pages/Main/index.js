import React from 'react';
import { Table, Button , Modal, notification, Popconfirm, message } from 'antd';
import './style.css';
import axios from 'axios';
import { Form, Input } from "@rocketseat/unform";
import * as Yup from 'yup';

import logo from '../../assets/imgs/logo.png';

const schema = Yup.object().shape({
  title: Yup.string().required('Título é obrigatório!'),
  description: Yup.string().required('Descrição é obrigatório!'),
})

function cancel(e) {
  message.error('Cancelado!')
}

class Main extends React.Component {

  state = {
    data: [],
    visible: false,
  }

  componentDidMount() {
    var config = {
      headers: {'Authorization': "bearer " + window.localStorage.getItem('api_token')}
    };
    axios.get('https://unform-backend.herokuapp.com/boxes', config).then(res => {
      console.log(res.data);
      this.setState({ data: res.data })
    }).catch(err => {
      console.log(err)
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleSubmit = (data) => {
    console.log(data);
    axios.post('https://unform-backend.herokuapp.com/boxes', data).then(res => {
      console.log(res.data);

      notification.success({
        message: 'Cadastrado com sucesso!'
      })

      const newData = {
        key: res.data._id,
        title: res.data.title,
        description: res.data.description,
      };

      this.setState({ data: [newData, ...this.state.data], visible: false })
    }).catch(err => {
      console.log(err)
    })
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleClick(param) {
    this.setState({ loading: true })
    const urlDelete = `https://unform-backend.herokuapp.com/boxes/${param}`
    axios
      .delete(urlDelete)
      .then(res => {
        window.location.reload()
        notification.success({
          message: 'Deletado com sucesso!',
        })
      })
      .catch(error => {
        this.setState({ loading: false })
        // console.log(error.response)
        notification.error({
          message: 'Erro ao deletar!',
        })
      })
  }

  render() {

    const data = this.state.data.map(box => {
      return {
        key: box._id,
        title: box.title,
        description: box.description,
      }
    });

    const columns = [
      {
        title: 'Título',
        dataIndex: 'title',
      },
      {
        title: 'Descrição',
        dataIndex: 'description',
      },
      {
        title: 'Ações',
        dataIndex: '',
        key: 'x',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="Deletar box?"
              onConfirm={this.handleClick.bind(this, record.key)}
              onCancel={cancel}
              okText="Sim"
              cancelText="Não"
            >
              <a>Deletar</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div className="container">
        <header>
          <img src={logo} alt="Logo Docluz" className="logo" />
        </header>
        <div className="body-user">
          <div className="boxForm">
            <div className="infos">
              <p>Boxes</p>
              <Button type="primary" className="color" onClick={this.showModal}>Cadastrar box</Button>
            </div>
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={null}
            >
              <Form schema={schema} onSubmit={this.handleSubmit}>
                <Input name="title" placeholder="Título" className="ant-input" />
                <Input name="description" placeholder="Descrição" className="ant-input" />
                <button type="submit" className="btnSave">Salvar</button>
              </Form>
            </Modal>
            <Table columns={columns} dataSource={data} />,
          </div>
        </div>
      </div>
    );

  }
}

export default Main