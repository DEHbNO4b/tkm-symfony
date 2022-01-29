import React from 'react';
import './styles.scss'

export default class NewTreeForm extends React.Component {
    constructor(props){
    	super(props);
    	this.state = {
    		activated: false,
			nacional: false,
			load: false
		};
		this.newTree = this.newTree.bind(this);
		this.saveNewTree = this.saveNewTree.bind(this);
		this.nationalSel = this.nationalSel.bind(this);
    }
	
	newTree(){
		this.setState({activated: true});
	}
	
	nationalSel(){
		this.refs.nacional_set.disabled = !this.refs.nacional_set.disabled;
		if(this.refs.nacional_set.disabled){this.refs.nacional_set.value = '';}
	}
	
	saveNewTree(){
		if(this.refs.name.value != '' && this.refs.last_name.value != ''){
		if((this.refs.nacional_set.disabled) || (this.refs.nacional_set.value != '')){
		
		this.setState({activated: false});
		this.setState({load: true});
		
		var firstname = this.refs.name.value;
		var lastname = this.refs.last_name.value;
		var nacional = this.refs.nacional_set.value;
				
		
				fetch('/addTreeFormSave', {
					method: 'POST',
					headers: {'Content-Type':'aplication/json'},
					body: JSON.stringify({
						"firstname": firstname,
						"lastname": lastname,
						"nationality": nacional
					})
				})
				.then((response) => response.json())
				.then(responseData => {
					if(responseData.result === 'ok'){
						this.props.history.push('/showTree/'+responseData.id);
					} else {
						alert('Ошибка добавления!');
					}
				});
		} else {
			alert('Активированное поле "Национальность" не заполнено. Заполните или деактивируйте поле для продоления.');
		}
		
		} else {
			alert('Для продолжения должны быть заполненны поля "Имя" и "Фамилия".');
		}
	}
    
    render() {
        if(this.state.activated)
        {
			return (
				<div className='form_new_tree'>
				<table border='0'>
					<tr><td colspan='2'>Создание первоначального узла дерева</td></tr>
					<tr><td>Имя: </td><td><input type='text' ref='name' name='name' /></td></tr>
					<tr><td>Фамилия: </td><td><input type='text' ref='last_name' name='last_name' /></td></tr>
					<tr><td colspan='2'><input type='checkbox'  ref='national_chek' name='nacional_chek' onClick={ this.nationalSel } /> Указать национальность</td></tr>
					<tr><td colspan='2'><input type='text' ref='nacional_set' name='nacional_set' disabled /></td></tr>
					<tr><td colspan='2'><input type='button' onClick={ this.saveNewTree } value='Сохранить' /></td></tr>
					</table>
				</div>
			);
		}
		else if(this.state.load){
			return (
				<div>
					Загрузка...
				</div>
				);
		} else {
			return (
				<div>
					<div className='bt_add_tree' onClick={ this.newTree }>Создать генеалогическое дерево</div>
				</div>
				);
		}
    }
}