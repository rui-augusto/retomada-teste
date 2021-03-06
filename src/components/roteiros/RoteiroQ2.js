import "./Roteiro.css"
import { useEffect, useState } from 'react';
import { useUser } from "../../context/user";
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useInterviewed } from "../../context/interviewed";


export const RoteiroQ2 = () => {
    
    useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {},
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
        shouldUseNativeValidation: false,
        delayError: undefined
    });

    const {register, handleSubmit} = useForm();

    const {
        register: register2,
        handleSubmit: handleSubmit2
    } = useForm();

    const navigate = useNavigate();
    const {id} = useParams();


    const contextUser = useUser();
    const context = useInterviewed();

    const [recusa, setRecusa] = useState(false);
    const [desfecho, setDesfecho] = useState(false);
    const [contatoProximo, setContatoProximo] = useState(false);
    const [outraRelacao, setOutraRelacao] = useState(false);
    const [nomeCP, setNomeCP] = useState("");
    
    useEffect(async () => {
        var contatoProximo = await context.getInfoOfClosedContact(id, "idUnicoGeradorDoContato");
        var nome = await context.getInfoOfConfirmedCase(contatoProximo, "nome");
        setNomeCP(nome);
    }, []);

    const recusaEntrevista = (event) => {
        if (event.target.checked == true){
            setRecusa(true);
        } else{
            setRecusa(false);
        }
    };

    const desfechoEntrevista = (event) => {
        if (event.target.checked === true){
            setDesfecho(true);
        } else{
            setDesfecho(false);
        }
    };

    const mudaPagina = () => {
        navigate(`../monitoramentoContatosProximos/${id}`);
    }

    const enviaRecusa = async (data) => {
        const dataHorarioAgora = new Date().setHours(0,0,0) / 1000;
        const entrevistador = contextUser.user.email;
        const nome = await context.getInfoOfClosedContact(id, "nome");
        const telefone = await context.getInfoOfClosedContact(id, "telefone1")

        const obj = {
            dtInclusaobanco: dataHorarioAgora,
            entrevistador: entrevistador,
            idUnico: id,
            motivoRejeicao: data.motivoRejeicao,
            nome: nome,
            origem: "contatoProximo",
            telefone: telefone
        } 
        context.refusalQuestCP(id, obj);
    }

    const enviaDesfecho = async (data) => {
        const updates = {};

        var entrevistador = contextUser.user.email;
        var dataAgora = new Date();

        updates['/ContatosProximos/' + id + '/objetoDados/situacao'] = data.desfecho;
        updates['/ContatosProximos/' + id + '/objetoDados/entrevistador'] = entrevistador;
        updates['/ContatosProximos/' + id + '/objetoDados/logSituacao'] = `${entrevistador} alterou a situa????o para ${data.desfecho} em ${dataAgora}`;
        updates['/ContatosProximos/' + id + '/objetoDados/obs'] = data.obs;
        await context.changeData(updates);
    }

    const seContatoProximo = (event) => {
        setContatoProximo(event.target.checked);
        console.log(event.target.checked);
    }

    const analyzeRelation = (event) => {
        if (event.target.value == "outro"){
            setOutraRelacao(true);
        }
    }

    const cadastraCP = async (data) => {
        console.log(data);
    }

    return( 

        <div>

            <body className="fullscreenArea-questions" onSubmit={handleSubmit}> 
            
            <div className="content-questions" >
                            <div className="InputArea">

                                <div className='line-questions'>
                                    <div className='input-questions'>
                                        <input 
                                        type="text"
                                        name="nome"
                                        value={contextUser.user.name}
                                        placeholder="Nome do Entrevistador"
                                        />
                                    </div>

                                    <div className='input-questions'>
                                        <input
                                        type="date"
                                        name="data"
                                        placeholder="Data"
                                        />
                                    </div>
                                
                                    <div className='input-questions'>
                                        <input
                                        type="time"
                                        name="hora"
                                        placeholder="Hora"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    <div className="DescriptionArea">
                        <div className="Description">
                            <h3>AP??NDICE D</h3> <p>Instrumento da Pesquisa</p>                       
                        </div>

                        <div className="Info">
                            <p>Monitoramento e Ratreamento de Contato Pr??ximos </p>
                            <p>Question??rio telef??nico</p>
                        </div>
                   
                        <div className="textArea">   
                            <p className="pTextArea">Bom dia/Boa tarde! </p><hr/>

                            <div className="TextAreaInfo"> </div>
                                <br></br>
                                Meu nome ?? {contextUser.user.name}, sou entrevistador(a) da Universidade Federal de Ouro Preto 
                                e estou realizando o rastreamento e monitoramento para COVID-19 na comunidade acad??mica.<br/><br/> 
                                Como parte das medidas de controle da transmiss??o da COVID-19, n??s recebemos da Universidade a informa????o que voc?? teve contato com o(a) {nomeCP} que testou positivo recentemente. <br/><br/>
                                Podemos conversar? <br/>
                                Sua participa????o ?? muito importante. <br/>
                                Esta conversa ter?? dura????o de aproximadamente 7 minutos.  
                                <p>Gostar??amos de lhe fazer algumas perguntas. </p><br/>
                                <p> As informa????es dadas pelo(a) Sr.(a) n??o ser??o divulgadas, manteremos sigilo de todas as informa????es prestadas aqui, tudo bem?!</p>  
                                <p>Vamos come??ar?</p>
                            </div>

                            <div className="internedcheckArea">
                                <div>Caso o entrevistado n??o queira ser entrevistado,
                                assinalar: &nbsp;                     
                                </div>
                            </div>
                              
                            <div className="recusa">
                                <div>
                                    <label className="internedCheckArea-btn">
                                    <input 
                                        type='checkbox' 
                                        name='recusa' 
                                        value='recusa'
                                        onClick = {recusaEntrevista}
                                        />  
                                        &nbsp; Recusa
                                    </label>
                                </div>

                                <div className="selectRecusa">
                                    {recusa &&
                                        <div>
                                            <form onSubmit = {handleSubmit(enviaRecusa)}>
                                                <select {...register("motivoRejeicao")} className='inputquest' >
                                                    <option value="">Motivo rejeicao...</option>
                                                    <option value="naoEntendeu">N??o entendeu a proposta do question??rio</option>
                                                    <option value="pessoaInadequada">Pessoa inadequada para responder o question??rio</option>
                                                    <option value="Hor??rio incoveniente">Hor??rio incoveniente</option>
                                                    <option value="ofendido">Sentiu-se ofendido</option>
                                                    <option value="recusaDados">Recusa passar dados</option>
                                                    <option value="outro">Outro</option>
                                                </select>
                                                <input className="observacao"{...register("obs")} type = "textArea" placeholder="Observa????o"/>
                                                <button className="btnRecusa">Finalizar</button>
                                            </form>
                                        </div>
                                    }  
                                </div>

                                <label className="internedCheckArea-btn">
                                <input 
                                    type='checkbox' 
                                    name='recusa' 
                                    value='recusa'
                                    onClick={desfechoEntrevista}
                                    />  
                                    &nbsp; Dar desfecho
                                </label>
                                {desfecho &&
                                    <div className = "recusa">
                                        <form onSubmit = {handleSubmit(enviaDesfecho)}>
                                            <select {...register("desfecho")} className='inputquest' >
                                                <option value="">Desfecho...</option>
                                                <option value="recuperado">Recuperado</option>
                                                <option value="encerrado">Encerrado</option>
                                                <option value="obito">??bito</option>
                                                <option value="perdaSegmento">Perda de Segmento</option>
                                            </select>
                                            <input className="inputObs"{...register("obs")} type = "textArea" placeholder="Observa????o.."/>
                                            <div className="btn">
                                            <button className="btn-finalizar">Finalizar</button></div>
                                        </form>
                                    </div>
                                }
                                <label className="internedCheckArea-btn">
                                <input 
                                    type='checkbox' 
                                    name='contatoProximo' 
                                    value='contatoProximo'
                                    onClick={seContatoProximo}
                                    />  
                                    &nbsp; Teve contato com algu??m da UFOP?
                                </label>
                                {contatoProximo && 
                                    <div>
                                        <form className='formquestcontato' onSubmit = {handleSubmit2(cadastraCP)}>
                                            <div className="vinculoUFOP">
                                                Possui v??nculo com a UFOP? &nbsp; <input {...register2("vinculoUFOP")} type = "checkbox" required/> &nbsp; Sim
                                            </div>
                                            <input {...register2("nome")} type = "text" placeholder = "nome do contato"/>
                                            <input {...register2("telefone1")} type = "number" placeholder = "telefone de contato 1" required/>
                                            <input {...register2("telefone2")} type = "number" placeholder = "telefone de contato 2"/>
                                            <select {...register2("relacao")} onClick = {analyzeRelation}>
                                                <option value="">Rela????o com o caso...</option>
                                                <option value="domiciliar">Domiciliar</option>
                                                <option value="familiar">Familiar (extradomiciliar)</option>
                                                <option value="laboral">Laboral</option>
                                                <option value="estudantil">Estudantil</option>
                                                <option value="eventoSocial">Evento social</option>
                                                <option value="outro">Outro</option>
                                            </select>
                                            { outraRelacao &&
                                                <div className="relacao">
                                                    <input {...register2("outraRelacao")} type = "text" placeholder = "tipo de rela????o"/>
                                                </div>
                                            }
                                            <div className="dataContato">
                                                Data do ??ltimo contato com o caso confirmado
                                                <div className="inputDataContato">
                                                    <input {...register2("dataUltimoContato")} type = "date"/>
                                                </div>
                                            </div>
                                            <div className="btns">
                                                <button type = "submit" className="btn-finalizar">Cadastrar</button>
                                            </div>
                                        </form>
                                    </div>
                                }    
                                {!recusa && !desfecho && !contatoProximo &&
                                    <div className="btn-startArea"> 
                                        <button 
                                            className="btn-start" 
                                            type="submit"
                                            onClick={mudaPagina}>                               
                                            Pr??ximo
                                        </button>
                                    </div>
                                }
                                
                            </div>
                    </div>

            </body> 
        </div>
    
    );
}