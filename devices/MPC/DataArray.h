template <typename T>
class DataArray {
private:
    T* array;
    int size;
    int capacity_;
public:
    // Construtor
    DataArray(int capacity) {
        size = 0;
        capacity_ = capacity;
        array = new T[capacity];
    }
    
    // Destrutor
    ~DataArray() {
        delete[] array;
    }
    
    // Método para adicionar um elemento ao array
    void push_back(const T& data) {
        if (size < capacity()) {
            array[size] = data;
            size++;
        } else {
            Serial.println("Array cheio!");
        }
    }
    
    // Método para remover e retornar o último elemento adicionado
    T pop() {
        if (size > 0) {
            T data = array[size - 1];
            size--;
            return data;
        } else {
            Serial.println("Array vazio!");
            return T(); // Retorna um objeto do tipo T vazio
        }
    }
    
    // Método para obter o tamanho atual do array
    int getSize() {
        return size;
    }
    
    // Método para obter a capacidade máxima do array
    int capacity() {
        return capacity_;
    }
    
    // Método para acessar os elementos do array por índice
    T getDataByIndex(int index) {
        if (index < size) {
            return array[index];
        } else {
            Serial.println("Índice inválido!");
            return T(); // Retorna um objeto do tipo T vazio
        }
    }
};
