<?php
// Lista de destinatários
$destinatarios = [
    'weboss@gmail.com'
];

// Configurações de teste
$assunto = 'Teste de Envio de E-mail';
$mensagem = "Teste de E-mail\n\n" .
            "Data: " . date('Y-m-d H:i:s') . "\n" .
            "Servidor: " . gethostname() . "\n" .
            "PHP Version: " . phpversion();

// Cabeçalhos mais detalhados
$headers = "From: teste@weboss.com.br\r\n" .
           "Reply-To: noreply@weboss.com.br\r\n" .
           "X-Mailer: PHP/" . phpversion() . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

// Tenta enviar o e-mail para cada destinatário
$resultados = [];
foreach ($destinatarios as $para) {
    $enviado = mail($para, $assunto, $mensagem, $headers);
    $resultados[$para] = $enviado;
}

// Log detalhado
$logResultado = date('Y-m-d H:i:s') . " - Teste de E-mail:\n";
foreach ($resultados as $email => $status) {
    $logResultado .= "Destinatário: $email\n" .
                     "Status: " . ($status ? "SUCESSO" : "FALHA") . "\n";
}
$logResultado .= "Último Erro: " . print_r(error_get_last(), true) . "\n" .
                 "-------------------\n";

file_put_contents('email_test_log.txt', $logResultado, FILE_APPEND);

// Exibe informações de diagnóstico
echo "Teste de E-mail:\n";
foreach ($resultados as $email => $status) {
    echo "Destinatário: $email\n";
    echo "Status: " . ($status ? "E-mail enviado com sucesso!" : "Falha no envio do e-mail.") . "\n";
}

echo "\nDiagnóstico:\n";
echo "Sendmail Path: " . ini_get('sendmail_path') . "\n";
echo "Configurações de E-mail:\n";
echo "mail.add_x_header: " . ini_get('mail.add_x_header') . "\n";
echo "sendmail_from: " . ini_get('sendmail_from') . "\n";
?>
