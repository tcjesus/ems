import json
import os

class JsonFileHandler():
    def __init__(self, filepath):
        self.filepath = filepath
        # Cria o arquivo se ele não existir
        if not os.path.exists(filepath):
            open(filepath, 'w').close()  # Cria um arquivo vazio

    def write_to_file(self, data):
        with open(self.filepath, 'a') as file:  # Abre o arquivo no modo append
            file.write(json.dumps(data) + '\n')  # Escreve o objeto JSON como uma nova linha

    def read_line_by_line(self, parameter_key, parameter_value):
        with open(self.filepath, 'r') as file:
            for line in file:
                data = json.loads(line.strip())  # Carrega a linha como um objeto JSON
                if data.get(parameter_key) == parameter_value:
                    return data
        return None

    def get_line_number(self, parameter_key, parameter_value):
        with open(self.filepath, 'r') as file:
            for i, line in enumerate(file, start=1):
                data = json.loads(line.strip())
                if data.get(parameter_key) == parameter_value:
                    return i
        return None

    def delete_line(self, line_number):
        with open(self.filepath, 'r') as file:
            lines = file.readlines()
        
        if line_number < 1 or line_number > len(lines):
            return False  # Linha inválida

        del lines[line_number - 1]

        with open(self.filepath, 'w') as file:
            file.writelines(lines)
        
        return True
    
    def is_empty(self):
        return os.path.getsize(self.filepath) == 0
    
    def get_number_of_lines(self):
        with open(self.filepath, 'r') as file:
            return sum(1 for line in file)

    def get_line(self, line_number):
        with open(self.filepath, 'r') as file:
            for i, line in enumerate(file, start=1):
                if i == line_number:
                    return json.loads(line.strip())
        return None

# Exemplo de uso da classe
# if __name__ == "__main__":
#     filepath = 'data.json'
#     handler = JsonFileHandler(filepath)

#     # Escrevendo dados no arquivo
#     handler.write_to_file({"id": 1, "name": "Alice"})
#     handler.write_to_file({"id": 2, "name": "Bob"})
#     handler.write_to_file({"id": 3, "name": "danilo"})
#     handler.write_to_file({"id": 4, "name": "gabriel"})
    
#     # Lendo uma linha específica
#     line = handler.read_line_by_line("id", 2)
#     if line:
#         print("Linha encontrada:", line)
#     else:
#         print("Linha não encontrada.")

#     # Obtendo o número da linha de um dado específico
#     line_number = handler.get_line_number("id", 3)
#     if line_number:
#         print("Número da linha:", line_number)
#     else:
#         print("Linha não encontrada.")
    
#     # Excluindo uma linha pelo número da linha
#     if handler.delete_line(line_number):
#         print(f"Linha {line_number} excluída com sucesso.")
#     else:
#         print("Falha ao excluir a linha.")
