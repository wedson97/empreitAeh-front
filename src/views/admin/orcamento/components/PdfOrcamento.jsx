import React, { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/img/auth/favicon.png";

const PdfObra = ({ setPdfVisible, row }) => {
    const contentRef = useRef();
    const navigate = useNavigate();
    const generatePDF = () => {
        const input = contentRef.current;

        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("portrait", "mm", "a4");
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

                const blob = pdf.output("blob");
                const url = URL.createObjectURL(blob);
                window.open(url);
            }).catch(err => console.error("html2canvas error: ", err));
        } else {
            console.error("Elemento não encontrado para gerar PDF.");
        }
    };

    useEffect(() => {
        generatePDF();
        navigate("/admin/orcamento");
        setPdfVisible(false);
    }, []);

    return (
        <div ref={contentRef} style={styles.container}>
            <div style={styles.header}>
                <img src={logo} alt="Logo da EmpreitaEh" style={styles.logo} />
                <h1 style={styles.title}>EmpreitaEh</h1>
            </div>
            <h2 style={styles.subtitle}>Detalhes do orçamento</h2>
            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.label}><strong>ID da Obra:</strong></td>
                        <td>{row.id}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Dono da Obra:</strong></td>
                        <td>{row.dono_obra.nome} (CPF: {row.dono_obra.cpf}, Email: {row.dono_obra.email})</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Descrição:</strong></td>
                        <td>{row.descricao}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Data de Criação:</strong></td>
                        <td>{new Date(row.data_criacao).toLocaleDateString('pt-BR')}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Data de Aprovação:</strong></td>
                        <td>{new Date(row.data_aprovacao).toLocaleDateString('pt-BR')}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Data de Início:</strong></td>
                        <td>{new Date(row.data_inicio).toLocaleDateString('pt-BR')}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Data de Término:</strong></td>
                        <td>{new Date(row.data_termino).toLocaleDateString('pt-BR')}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Quantidade de Metros:</strong></td>
                        <td>{row.qtd_metros}</td>
                    </tr>
                    <tr>
                        <td style={styles.label}><strong>Valor por Metro:</strong></td>
                        <td>R$ {row.valor_metro}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// Estilos para o PDF
const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#fff',
        marginTop: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
    },
    logo: {
        width: '100px', // Ajuste o tamanho conforme necessário
        height: 'auto',
        marginRight: '20px',
    },
    title: {
        fontSize: '24px', // Aumenta o tamanho da fonte
        color: '#e8661e',
        margin: 0,
    },
    subtitle: {
        textAlign: 'center',
        margin: '10px 0',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    label: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        fontWeight: 'bold',
        textAlign: 'right',
        verticalAlign: 'top',
    },
};

export default PdfObra;
