import "./Roteiro.css"
import { useState, useEffect } from 'react';
import { useUser } from "../../context/user";
import { useInterviewed } from "../../context/interviewed";
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';



export const RoteiroQ1 = () => {

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

    const navigate = useNavigate();
    const {cpf, nome} = useParams();

    // const [dataHoje, setDataHoje] = useState(new Date());
    // const [horarioAgora, setHorarioAgora] = useState();

    const mudaPagina = () => {
        var novoCpf = cpf.toString();
        const novoZero = "0";
        while (novoCpf.length != 11){
            novoCpf = novoZero.concat(cpf);
        }
        console.log("CPF como veio: " + cpf);
        console.log("CPF certo: " + novoZero);
        navigate(`../questionario/${novoCpf}/${nome}`);
    }

    const contextUser = useUser();
    const context = useInterviewed();

    const [recusa, setRecusa] = useState(false);
    const [desfecho, setDesfecho] = useState(false);

    const recusaEntrevista = (event) => {
        if (event.target.checked == true){
            setRecusa(true);
        } else{
            setRecusa(false);
        }
    };

    const desfechoEntrevista = (event) =>{
        if (event.target.checked === true){
            setDesfecho(true);
        } else{
            setDesfecho(false);
        }
        const data = new Date();
        console.log(data);
    }

    const enviaRecusa = async (data) => {
        console.log(data);
        var dataHorarioAgora = new Date().setHours(0,0,0) / 1000;
        var entrevistador = contextUser.user.email;

        var nome = await context.getRefFromDataBase(`Confirmados/${cpf}/objetoDados/nome`);
        var origem = await context.getRefFromDataBase(`Confirmados/${cpf}/objetoDados/origem`);
        var telefone = await context.getRefFromDataBase(`Confirmados/${cpf}/objetoDados/telefone`);

        const obj = {
            dtInclusaoBanco: dataHorarioAgora,
            entrevistador: entrevistador,
            idUnico: cpf,
            motivoRejeicao: data.motivoRejeicao,
            nome: nome,
            obs: data.obs,
            origem: origem,
            telefone: telefone
        }   
        await context.refusalQuest(cpf, obj);
        navigate(`/home/${contextUser.user.uid}`);
    }

    const enviaDesfecho = async (data) => {
        var novoCpf = cpf.toString();
        const novoZero = "0";
        while (novoCpf.length != 11){
            novoCpf = novoZero.concat(cpf);
        }
        
        const updates = {};
        
        var entrevistador = contextUser.user.email;
        var dataAgora = new Date();

        updates['/Confirmados/' + novoCpf + '/objetoDados/situacao'] = data.desfecho;
        updates['/Confirmados/' + novoCpf + '/objetoDados/entrevistador'] = entrevistador;
        updates['/Confirmados/' + novoCpf + '/objetoDados/logSituacao'] = `${entrevistador} alterou a situa????o para ${data.desfecho} em ${dataAgora}`;
        updates['/Confirmados/' + novoCpf + '/objetoDados/obs'] = data.obs;

        await context.changeData(updates);

    }

    return( 

        //TIRAR ESSE FORM EXTERNO

        <div>
            <body className="fullscreenArea-questions"> 
                <div className="DescriptionArea">
                <form className="content-questions" >
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
                </form>
                <div className="Description">
                    <h3>AP??NDICE D</h3> <p>Instrumento da Pesquisa</p>                       
                </div>

                <div className="Info">
                    <p>Monitoramento de casos confirmados para o COVID-19 </p>
                    <p>Question??rio telef??nico</p>
                </div>
            
                <div className="textArea">   
                    <p className="pTextArea">Bom dia/Boa tarde! </p><hr/>

                    <div className="TextAreaInfo"> </div>
                        <br></br>
                        Meu nome ?? {contextUser.user.name}, sou entrevistador(a) da Universidade Federal de Ouro Preto 
                        e estou realizando o rastreamento e monitoramento para COVID-19 na comunidade acad??mica.<br/><br/> 
                        Como parte das medidas de controle da transmiss??o da COVID-19, n??s recebemos da Universidade a informa????o que voc?? testou positivo recentemente. <br/><br/>
                        Podemos conversar? <br/>
                        Sua participa????o ?? muito importante. <br/>
                        Esta conversa ter?? dura????o de aproximadamente 7 minutos.  
                        <p>Gostar??amos de lhe fazer algumas perguntas. </p><br/>
                        <p> As informa????es dadas pelo(a) Sr.(a) n??o ser??o divulgadas, manteremos sigilo de todas as informa????es prestadas aqui, tudo bem?!</p>  
                        <p>Vamos come??ar?</p>
                    </div>

                    <div className="textArea">
                        Caso o entrevistado n??o queira ser entrevistado, assinalar:<br/> &nbsp;                     
                        
                            <label className="internedCheckArea-btn">
                            <input 
                                type='checkbox' 
                                name='recusa' 
                                value='recusa'
                                onClick={recusaEntrevista}
                                />  
                                &nbsp; Recusa
                            </label>
                            {recusa &&
                                <div className="recusa">
                                    <form onSubmit = {handleSubmit(enviaRecusa)}>
                                        <select {...register("motivoRejeicao")} className='inputquest' >
                                            <option value="">Motivo da rejei????o...</option>
                                            <option value="naoEntendeu">N??o entendeu a proposta do question??rio</option>
                                            <option value="pessoaInadequada">Pessoa inadequada para responder o question??rio</option>
                                            <option value="Hor??rio incoveniente">Hor??rio incoveniente</option>
                                            <option value="ofendido">Sentiu-se ofendido</option>
                                            <option value="recusaDados">Recusa passar dados</option>
                                            <option value="outro">Outro</option>
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
                    
                    </div>
                    {!recusa && !desfecho &&
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

            </body> 
        </div>
    
    );
}