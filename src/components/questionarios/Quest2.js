// MONITORAMENTO DE CONTATO PROXIMO

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useInterviewed } from "../../context/interviewed";
import { useUser } from "../../context/user";
import { BlocoContProximo } from "../orientacoes/BlocoContProximo";
import { useNavigate, useParams } from 'react-router-dom';

import "./Quest2.css";

export const Quest2 = () => {

    const context = useInterviewed();
    const contextUser = useUser();
    const { id } = useParams();

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

    const [outraRelacao, setOutraRelacao] = useState(false);
    const [estudante, setEstudante] = useState(false);
    const [docente, setDocente] = useState(false);
    const [fezTeste, setFezTeste] = useState(false);
    const [entrevistado, setEntrevistado] = useState(false);
    const [horaInicio, setHoraInicio] = useState(0);
    const [nomeEntrevistado, setNomeEntrevistado] = useState("");

    useEffect(async () =>{
        setNomeEntrevistado(await context.getInfoOfClosedContact(id, "nome"));
        setHoraInicio(new Date().setHours(0,0,0) / 1000);
    }, []);

    const analyzeRelation = (event) => {
        if (event.target.value == "outro"){
            setOutraRelacao(true);
        }else{
            setOutraRelacao(false);
        }
    }

    const analyzeOccupation = (event) => {
        if (event.target.value == "estudante"){
            setDocente(false);
            setEstudante(true);
        }
        else {
            setEstudante(false);
            setDocente(true);
        }
    }

    const analyzeTest = (event) => {
        if (event.target.value == "sim"){
            setFezTeste(true);
        }else{
            setFezTeste(false);
        }
    }

    const submitData = async (data) => {
        console.log(data);

        var dataHorarioAgora = new Date().setHours(0,0,0) / 1000;

        var email = contextUser.user.email;

        var idGeradorContato = context.getInfoOfClosedContact(id, "idUnicoGeradorDoContato");

        var where = `${id}-${dataHorarioAgora*1000}`;

        const objContatoProximo = {
            dataEntrevista: dataHorarioAgora,
            entrevistador: email,
            horaFim: dataHorarioAgora,
            horaInicio: horaInicio,
            idUnico: id,
            idUnicoGeradorDoContato: idGeradorContato,
            obs: "null",
        };

        const objFinalDados = Object.assign({}, data, objContatoProximo);

        // objFinalDados = Object.assign({}, objFinalDados, nome);

        console.log(context.getInfoOfClosedContact(id, "nome"));
        console.log(objContatoProximo);
        await context.registerMonitoringCloseContacts(objFinalDados, where);
        await context.addQtdEntrevistaContatoProximo(id);

        await dadosContatoProximo();
        setEntrevistado(true);
    }

    const dadosContatoProximo = async () => {
        const updates = {};
        const dataHorarioAgora = new Date().setHours(0,0,0) / 1000;
        const email = contextUser.user.email;
        const date = new Date();

        // const proxEntrevistaInfo = await getInfoOfClosedContact(id, "dataProximaEntrevista");
        // const proxEntrevista = parseInt(proxEntrevistaInfo);

        updates['/ContatosProximos/' + id + '/objetoDados/situacao/'] = "andamento";
        updates['/ContatosProximos/' + id + '/objetoDados/dataUltimaMudancaSituacao/'] = dataHorarioAgora;
        updates['/ContatosProximos/' + id + '/objetoDados/contTentativas/'] = 0;
        updates['/ContatosProximos/' + id + '/objetoDados/entrevistador/'] = email;
        updates['/ContatosProximos/' + id + '/objetoDados/log/'] = `${email} entrevistou em ${date}`;
        updates['/ContatosProximos/' + id + '/objetoDados/dataProximaEntrevista/'] = parseInt(dataHorarioAgora) + 172800;

        await context.changeData(updates);
        // await context.verifyNextInterviewCC(id);
    }

    return (
        <div>
            {!entrevistado &&
                <div className="fullArea2">
                    <form className="formAreaQuest2" onSubmit = {handleSubmit(submitData)}>
                        <div className="Description-quest">
                            <h3>AP??NDICE</h3> <p>Instrumento da Pesquisa</p>                       
                        </div>
                        <div className="Info-quest">
                            <p>Question??rio telef??nico dos Contatos Pr??ximos</p>
                            <p>Monitoramento</p>
                        </div>
                
                        <div className='nomeEntrevistado'>
                            Nome do(a) entrevistado(a)
                            <input className="inputquest" {...register("nome")} value = {nomeEntrevistado} type = "text" placeholder = "Nome do entrevistado"/>
                        </div>

                        <div className='relacao'>
                            Rela????o
                                <select className='inputquest' {...register("relacao")} onClick = {analyzeRelation}>
                                    <option value = "">Selecione...</option>
                                    <option value = "domiciliar">Domiciliar</option>
                                    <option value = "familiar">Familiar (extradomiciliar)</option>
                                    <option value = "laboral">Laboral</option>
                                    <option value = "estudantil">Estudantil</option>
                                    <option value = "eventoSocial">Evento social</option>
                                    <option value = "outro">Outro</option>
                                </select>
                        </div>
                        {outraRelacao &&
                            <div className='inputrelacao'>
                                <input {...register("outraRelacao")} type = "text" placeholder = "Especificar outra rela????o"/>
                            </div>
                        }

                        <div className='dataultimocontato'>
                            Data do ??ltimo contato com o positivo: 
                            <input {...register("ultimoContato")} type = "date"/>
                        </div>

                        <div className="sintomas">
                                Apresentou algum desses sintomas?
                                <div className="inputSintomas">
                                        <div className="espacamento">
                                            <div className="espacamentointerior"><input {...register("sintoma01")} type="checkbox" /> febre &nbsp;</div>
                                            <div className="espacamentointerior"><input {...register("sintoma02")} type="checkbox" /> dispineia &nbsp;</div>
                                            <div className="espacamentointerior"><input {...register("sintoma03")} type="checkbox" /> dor de garganta &nbsp;</div>
                                        </div>
                                        <div className="espacamento">
                                            <div className="espacamentointerior"><input {...register("sintoma04")} type="checkbox" /> dor de cabe??a &nbsp;</div>
                                            <div className="espacamentointerior"><input {...register("sintoma05")} type="checkbox" /> tosse &nbsp;</div>
                                            <div className="espacamentointerior"><input {...register("sintoma06")} type="checkbox" /> coriza &nbsp;</div>
                                        </div>
                                        <div className="espacamento">
                                            <div className="espacamentointerior"><input {...register("sintoma07")} type="checkbox" /> perda do olfato &nbsp;</div>
                                            <div className="espacamentointerior"><input {...register("sintoma08")} type="checkbox" /> perda do paladar &nbsp;</div>
                                            <div className="espacamentointerior"><input {...register("sintoma09")} type="checkbox" /> nenhum &nbsp;</div>
                                        </div>
                                    </div>
                                </div>
                            
                            <div className ="relacaoUfop">
                                Em qual campus e quais atividades voc?? realiza na/pela UFOP?
                            <div className='vinculoUfop'>
                                <select {...register("campus")}>
                                    <option value = "">Campus...</option>
                                    <option value = "ouroPreto">Ouro Preto</option>
                                    <option value = "mariana">Mariana</option>
                                    <option value = "joaoMonlevade">Jo??o Monlevade</option>
                                </select>

                                <div className='blocooptions'>
                                        <select {...register("ocupacao")} onChange = {analyzeOccupation}>
                                            <option value = "">Ocupa????o...</option>
                                            <option value = "estudante">Estudante</option>
                                            <option value = "docente">Docente</option>
                                            <option value = "tecnicoAdm">T??cnico Admnistrativo em Educa????o</option>
                                            <option value = "prestadorServico">Prestador de servi??os</option>
                                        </select>
                                    {estudante &&
                                            <input className="inputquesteCurso"{...register("numMatricula")} type = "number" placeholder = "Num. Matr??cula"/>
                                    }
                                    {docente &&
                                        <div className='options'>
                                            
                                            <select {...register("unidade")}>
                                                <option value = "">Unidade...</option>
                                                <option value = "reitoria">Reitoria</option>
                                                <option value = "proReitoria">Pr??-Reitoria de Gradua????o</option>
                                                <option value = "proReitoriaPesquisa">Pr??-Reitoria de pesquisa, p??s-gradua????o e inova????o</option>
                                                <option value = "proReitoriaExtensao">Pr??-Reitoria de extens??o e cultura</option>
                                                <option value = "proReitoriaComunitario">Pr??-Reitoria de assuntos comunit??rios e estudantis</option>
                                                <option value = "proReitoriaPlanejamento">Pr??-Reitoria de planejamento e administra????o</option>
                                                <option value = "proReitoriaFinancas">Pr??-Reitoria de finan??as</option>
                                                <option value = "proReitoriaGestao">Pr??-Reitoria de gest??o de pessoas</option>
                                                <option value = "prefeituraCampus">Prefeitura do Campus</option>
                                                <option value = "dirComunicacao">Diretoria de comunica????o institucional</option>
                                                <option value = "dirRelacoesInternacionais">Diretoria de rela????es internacionais</option>
                                                <option value = "dirTecnologia">Diretoria de tecnologia e informa????o</option>
                                                <option value = "dirBiblioteca">Diretoria de bibliotecas e informa????o</option>
                                                <option value = ""></option>
                                            </select>
                                        
                                            <select {...register("setor")}>
                                                <option value = "">Setor...</option>
                                                <option value = "cead">CEAD</option>
                                                <option value = "edtm">EDTM</option>
                                                <option value = "eef">Escola de Educa????o F??sica</option>
                                                <option value = "ef">Escola de Farm??cia</option>
                                                <option value = "eminas">Escola de Minas</option>
                                                <option value = "emedicina">Escola de Medicina</option>
                                                <option value = "en">Escola de Nutri????o</option>
                                                <option value = "iceb">ICEB</option>
                                                <option value = "ifac">IFAC</option>
                                                <option value = "ichs">ICHS</option>
                                                <option value = "icea">ICEA</option>
                                            </select>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </div>

                            <div className='TesteRealizado'>
                                Realizou teste?  &nbsp; 
                                    <input {...register("fezTeste")} onClick = {analyzeTest} type="radio" value="sim" /> sim &nbsp; 
                                    <input {...register("fezTeste")} onClick = {analyzeTest} type="radio" value="nao" /> n??o 
                            </div>

                                <div className='fezTeste'>
                                    {fezTeste &&
                                        <div>
                                            <div className='TipoTeste'>
                                                <select {...register("testeRealizado")}>
                                                        <option value = "">Teste Realizado...</option>
                                                        <option value = "antigeno">Teste R??pido - Antigeno</option>
                                                        <option value = "sorologico">Sorol??gico</option>
                                                        <option value = "pcr">PCR</option>
                                                        <option value = "naoSabe">N??o sei...</option>
                                                </select>
                                            </div>

                                            <div className='Resultado'>
                                                Resultado do teste: &nbsp; 
                                                <input {...register("resultadoTeste")} type = "radio" value = "positivo"/> positivo &nbsp; 
                                                <input {...register("resultadoTeste")} type = "radio" value = "negativo"/> negativo &nbsp; 
                                            </div>

                                        </div>

                                }
                                </div>

                        <div className='btnQ2'>
                            <button className="btn-finalizar" type = "submit">Finalizar</button>
                        </div>
                    </form>
                </div>
            }
            {entrevistado &&
                <div>
                    <BlocoContProximo />
                </div>
            }
        </div>
    );
}