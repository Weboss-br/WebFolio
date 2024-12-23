<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://weboss.com.br');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data && !empty($data['nome']) && !empty($data['email']) && !empty($data['mensagem'])) {
        // Sanitizar dados
        $nome = htmlspecialchars(trim($data['nome']));
        $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
        $mensagem = htmlspecialchars(trim($data['mensagem']));
        
        // Log em arquivo
        $log = date('Y-m-d H:i:s') . " | Nome: $nome | Email: $email | Mensagem: $mensagem\n";
        file_put_contents('contatos.txt', $log, FILE_APPEND);
        
        // Enviar e-mail
        $para = 'contato@weboss.com.br';
        $assunto = 'Nova Mensagem do Portfólio';
        $corpoEmail = "Nova mensagem recebida:\n\n" .
                      "Nome: $nome\n" .
                      "Email: $email\n" .
                      "Mensagem: $mensagem";
        
        $headers = "From: formulario@weboss.com.br\r\n" .
                   "Reply-To: $email\r\n" .
                   "X-Mailer: PHP/" . phpversion();
        
        $emailEnviado = mail($para, $assunto, $corpoEmail, $headers);
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Mensagem recebida e enviada com sucesso!',
            'emailEnviado' => $emailEnviado
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'status' => 'error', 
            'message' => 'Dados inválidos ou incompletos'
        ]);
    }
    exit();
}
?>