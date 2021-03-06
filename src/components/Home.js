import { useUser } from "../context/user";
import { useInterviewed } from "../context/interviewed";
import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

import { BancoConfirmados } from "./questionarios/BancoConfirmados";
import { BancoContatosProximos } from "./questionarios/BancoContatosProximos"
import { BancoMonitoramentoConfirmados } from "./questionarios/BancoMonitoramentoConfirmados";
import { BancoMonitoramentoContProximos } from "./questionarios/BancoMonitoramentoContProximos";

import "./style/Home.css"
import "./questionarios/Banco.css";
import { reload } from "firebase/auth";


export const Home = () => {

    const navigate = useNavigate();
    const contextUser = useUser();
    const contextInterviewed = useInterviewed();

    useEffect(async () => {
        await contextInterviewed.getInfoFromDatabase();
        await contextUser.getUserInfo(localStorage.getItem("id"));
    }, []);

    // console.log(contextInterviewed.lstConfirmados);
    // console.log(contextInterviewed.lstContProximos);

    const logout = async () => {
        await contextUser.userLogout(navigate);
    }

    const updateData = async () => {
        await contextInterviewed.getInfoFromDatabase();
        window.location.reload(false);
    }

    return (
        
        <div className='fullscreenAreaHome'>
            <div className="AreaPesquisa">
            
                <div className="titulo">
                    <h2>Bem-vindo(a), {contextUser.user.name}.</h2>
                    <button className = "buttonsHome" onClick = {logout}>Sair</button>
                    <button className = "buttonsHome" onClick = {updateData}>Atualizar</button>
                    </div>
                
                <div className="titulo"> 
                    <select>
                        <option value="" disabled selected hidden >Filtro</option>
                        <option value="antigo">Mais Antigo</option>
                        <option value="novo">Mais Novos</option>
                        <option value="vencimentoPr??ximo">Vencimento Pr??ximo</option>
                    </select>
                </div>

            </div> 

            <div className="BoxPessoas">

                <div className="primeiraLinha">
                    <div className="divisaolinhas"><h3>Banco de Confirmados</h3></div>
                    <div className="divisaolinhas">Total de {contextInterviewed.lstConfirmados.length} pessoas vis??veis no banco</div> 

                    <div className="divisaolinhas"><input placeholder="Procurar por paciente" type="search"></input></div>
                </div>

                <div className="segundaLinha">
                    <div className="infoNome">Nome</div>
                    <div className="infoTelefone">Telefone</div>
                    <div className="infoMonitorar">Monitorar at??</div>
                    <div className="infoSituacao">Situa????o</div>
                </div>
                <div className="chatNomes">
                    {contextInterviewed.lstConfirmados.map((item, key)=>(
                        <BancoConfirmados
                            confirmado={item}
                            key={key}
                        />
                    ))}
                </div>
            </div>
                    
                    
            <div className="BoxPessoas">

                <div className="primeiraLinha">
                    <div className="divisaolinhas"><h3>Banco de Contatos Pr??ximos</h3></div>
                    <div className="divisaolinhas">Total de {contextInterviewed.lstContProximos.length - 1} pessoas vis??veis no banco</div> 
                    <div className="divisaolinhas"><input placeholder="Procurar por paciente" type="search"></input></div>
                </div>

                <div className="segundaLinha">
                    <div className="infoNome">Nome</div>
                    <div className="infoTelefone">Telefone</div>
                    <div className="infoMonitorar">Monitorar at??</div>
                    <div className="infoSituacao">Situa????o</div>
                </div>
                <div className="chatNomes">
                    {contextInterviewed.lstContProximos.map((item, key)=>(
                        <BancoContatosProximos
                            contatoProximo={item} 
                            key={key}
                        />
                    ))}
                </div>
            </div>

            <div className="BoxPessoas">

                <div className="primeiraLinha">
                    <div className="divisaolinhas"><h3>Monitoramento Confirmados</h3></div>
                    <div className="divisaolinhas">Total de ---- pessoas vis??veis no banco</div> 
                    <div className="divisaolinhas"><input placeholder="Procurar por paciente" type="search"></input></div>
                </div>

                <div className="segundaLinha">
                    <div className="infoNome">Nome</div>
                    <div className="infoTelefone">Telefone</div>
                    <div className="infoMonitorar">Monitorar at??</div>
                    <div className="infoProxEntrevista">Pr??xima entrevista em</div>
                    <div className="infoSituacaoEntrevista">Situa????o Entrevistas</div>
                </div>
                <div className="chatNomes">
                    {contextInterviewed.lstConfirmados.map((item, key)=>(
                        <BancoMonitoramentoConfirmados
                            confirmado={item}
                            key={key}
                        />
                    ))}
                </div>
            </div>

            <div className="BoxPessoas">

                <div className="primeiraLinha">
                    <div className="divisaolinhas"><h3>Monitoramento Contatos Pr??ximos</h3></div>
                    <div className="divisaolinhas">Total de ---- pessoas vis??veis no banco</div> 
                    <div className="divisaolinhas"><input placeholder="Procurar por paciente" type="search"></input></div>
                </div>

                <div className="segundaLinha">
                    <div className="infoNome">Nome</div>
                    <div className="infoTelefone">Telefone</div>
                    <div className="infoMonitorar">Monitorar at??</div>
                    <div className="infoProxEntrevista">Pr??xima entrevista em</div>
                    <div className="infoSituacaoEntrevista">Situa????o Entrevistas</div>
                </div>
                <div className="chatNomes">
                    {contextInterviewed.lstContProximos.map((item, key)=>(
                        <BancoMonitoramentoContProximos
                            contatoProximo={item}
                            key={key}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}