<?php
// Log detalhado
function logEvent($message) {
    $logFile = 'email_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// Capturar dados de qualquer método
$rawInput = file_get_contents('php://input');
logEvent("Raw Input: " . $rawInput);

// Tentar decodificar JSON
$data = json_decode($rawInput, true);
logEvent("Dados decodificados: " . print_r($data, true));

// Se falhar, tentar $_POST
if (!$data) {
    $data = $_POST;
    logEvent("Dados via POST: " . print_r($data, true));
}

// Dados padrão para teste
$nome = $data['nome'] ?? 'Nome Teste';
$email = $data['email'] ?? 'teste@exemplo.com';
$whatsapp = $data['whatsapp'] ?? 'Não informado';
$mensagem = $data['mensagem'] ?? 'Mensagem de teste';

// Preparar e-mail
$para = 'weboss@gmail.com';
$assunto = 'Contato Formulário Weboss.com.br';
$corpoEmail = "Novo contato recebido:\n\n" .
              "Nome: $nome\n" .
              "Email: $email\n" .
              "Whatsapp: $whatsapp\n" .
              "Mensagem:\n$mensagem";

$headers = "From: {$email}\r\n" .
           "Reply-To: {$email}\r\n" .
           "X-Mailer: PHP/" . phpversion() . "\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

// Tentar enviar e-mail
$emailEnviado = @mail($para, $assunto, $corpoEmail, $headers);

logEvent("Tentativa de envio. Destinatário: {$para}, Status: " . ($emailEnviado ? 'Sucesso' : 'Falha'));

// Capturar último erro
$erro = error_get_last();
if ($erro) {
    logEvent("Detalhes do erro: " . print_r($erro, true));
}

// Resposta
echo json_encode([
    'status' => $emailEnviado ? 'success' : 'error', 
    'message' => $emailEnviado ? 'Mensagem enviada com sucesso!' : 'Falha ao enviar mensagem',
    'emailEnviado' => $emailEnviado
]);
exit();
?>