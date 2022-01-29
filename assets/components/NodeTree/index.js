import React from 'react'
import ReactDOM from 'react-dom'
import Node from './Node'
import Pair from './Pair'
import NavLink from '../../components/NavLink'
import "./styles.scss";

export default class NodeTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeId: 1,
            treeData: {},
            nodes: {},
            user: {},
            subscribed: false
        };
        this.prepareData = this.prepareData.bind(this);
        this.loadData = this.loadData.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.unsubscribe = this.unsubscribe.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }
    componentDidUpdate(){
        if(this.props.router.params.id !== this.state.treeId){
            this.setState({treeId:this.props.router.params.id});
            this.loadData();
        }
    }

    loadData(){
        this.setState({treeId: this.props.router.params.id});

        console.log("nodeTree.loadData()");
        console.log(this.props.router.params.id);


        fetch('/getCurrentUser')
            .then(response => response.json())
            .then(entries => {
                this.setState({
                    user: {
                        id: entries.userId,
                        lastname: entries.lastname,
                        name: entries.firstname,
                        phone: entries.mobileNumber,
                        email: entries.email
                    }
                });
                 fetch('/getTree/'+this.props.router.params.id)
                    .then(response => response.json())
                    .then(nodeEntries => {
                        this.setState({treeData: {}});
                        this.setState({
                            treeData: {
                                id: nodeEntries.userId,
                                family: nodeEntries.family,
                                adminId: nodeEntries.adminId,
                            }
                        });
                        fetch('/getTreeData/'+this.props.router.params.id)
                            .then(response => response.json())
                            .then(data => {
                                this.setState({
                                    nodes: {},
                                });
                                this.setState({
                                    nodes: this.prepareData(data, null, [parseInt(this.state.treeData.adminId)], []),
                                });
                            });
                        if(this.state.user && this.state.user.id && this.state.user.id != 0){
                            fetch('/userSubscribed/'+this.props.router.params.id)
                                .then(response=>response.json())
                                .then(respData=>{
                                    if(respData.subscribed == true){
                                        this.setState({subscribed : true});
                                    }
                                    else{
                                        this.setState({subscribed : false});
                                    }
                                });
                        }
                    });
            });
      



    }

    findEditableIds(nd, id){
        if(parseInt(nd.user_id) == parseInt(id)){
            return [parseInt(nd.person_id)];
        }
        else if(nd.marriages && nd.marriages.length !=0){
            if(nd.marriages[0].children && nd.marriages[0].children.length !=0){
                for(var i=0; i<nd.marriages[0].children.length; i++){
                    let res = this.findEditableIds(nd.marriages[0].children[i], id);
                    if(res.length != 0){
                        res.push(parseInt(nd.person_id));
                        return res;
                    }
                }
            }
        }
        return [];
    }


    prepareData(nd, parent, admins, editable){
        var context = this;
        var treeId = this.state.treeId;
        var editableIds = editable;
        let relations = {
            father: false,
            mother: false,
            spouse: false
        };

        if(parent == null && admins.length !=0 && editable.length == 0){
            editableIds = this.findEditableIds(nd, this.state.user.id);
        }
        let showControls = (admins.indexOf(this.state.user.id) != -1 
            || nd.user_id == this.state.user.id 
            || editableIds.indexOf(parseInt(nd.person_id)) != -1);

        if(parent != null){
            if(parent.name !== "Не указано"){
                if(parent.class=="man") relations.father=true;
                else relations.mother=true;    
            }
            if(parent.marriages && parent.marriages.length !=0){
                if(parent.marriages[0].spouse.id !=0 && parent.marriages[0].spouse.name != "Не указано"){
                    if(parent.class=="man") relations.mother=true;
                    else relations.father=true;    
                }
            }
        }
        if(nd.marriages && nd.marriages.length !=0){
            var spouseRelations = Object.assign({},relations);
            if(nd.name != "Не указано"){
                spouseRelations.spouse = true;
            }
            else relations.spouse = false;
            var spouseName = nd.marriages[0].spouse.name;
            var spouseId = nd.marriages[0].spouse.id;
            var spouseGender = (nd.marriages[0].spouse.class=="man")?"male":"female";
            var spouse = new Node(spouseId, spouseName, spouseGender, treeId, this.loadData, false, false, spouseRelations, showControls==true);
            var gender = (nd.class=="man")?"male":"female";
            if(nd.marriages[0].spouse.id != 0 && nd.marriages[0].spouse.name !== 'Не указано'){
                relations.spouse = true;
            }
            var showInvite = (nd.user_id==0)?true:false;
            var main = new Node(nd.person_id, nd.name, gender, treeId, this.loadData, true, showInvite, relations, showControls==true);
            var children = [];
            if(nd.marriages[0].children && nd.marriages[0].children.length !=0){
                let adminIds = admins;
                if(nd.user_id != 0 && this.state.user.id == nd.user_id){
                    adminIds.push(parseInt(nd.user_id));
                }
                nd.marriages[0].children.forEach(function(child){
                    children.push(context.prepareData(child, nd, adminIds, editableIds));
                });
                if(nd.user_id != 0 && this.state.user.id == nd.user_id){
                    adminIds.pop();
                }
            }
            return new Pair(main, spouse, children);
        }
        else{
            var gender = (nd.class=="man")?"male":"female";
            var showInvite = (nd.user_id==0)?true:false;
            return new Node(nd.person_id, nd.name, gender, treeId, this.loadData, true, showInvite, relations, showControls==true);
        }
    }



    subscribe(){
        fetch("/subscribe/"+this.state.treeId);
        this.setState({subscribed: true});
    }

    unsubscribe(){
        fetch("/unsubscribe/"+this.state.treeId);
        this.setState({subscribed: false});
    }

    render() {
return(<p>qqqqwwweee</p>);
        // let subscribeBtn = <div></div>
        // if(this.state.user && this.state.user.id && this.state.user.id != 0
        //     && this.state.treeData.adminId != this.state.user.id){
        //     if(this.state.subscribed == false){
        //         subscribeBtn =  <div className="addNewsLinkBtn tree_button" onClick={this.subscribe}>
        //                             <b>Подписаться</b>
        //                         </div>
        //     }
        //     else{
        //         subscribeBtn =  <div className="addNewsLinkBtn tree_button" onClick={this.unsubscribe}>
        //                             <b>Отписаться</b>
        //                         </div>
        //     }
        // }
        //
        // if(this.state.nodes.view){
        //     return (
        //         <div className="tree_container" ref="tree_container">
        //             <div class="tree_controls">
        //                 <div className="addNewsLinkBtn tree_button">
        //                     <b>
        //                         <NavLink to={"/news/tree/"+this.state.treeId}>Новости</NavLink>
        //                     </b>
        //                 </div>
        //                 {subscribeBtn}
        //             </div>
        //             <div className="row">{this.state.nodes.view}</div>
        //         </div>);//
        // }
        // else{
        //     return (<div></div>);
        // }
    }
  }