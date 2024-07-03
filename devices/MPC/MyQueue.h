template <typename T>
class Queue {
private:
    int front;
    int rear;
    int size;
    int capacity;
    T* array;

public:
    Queue(int capacity);
    ~Queue();
    void push(T item);
    T pop();
    bool isEmpty();
    int number_of_elements();
};

template <typename T>
Queue<T>::Queue(int capacity) {
    this->capacity = capacity;
    front = 0;
    size = 0;
    rear = capacity - 1;
    array = new T[capacity];
}

template <typename T>
Queue<T>::~Queue() {
    delete[] array;
}

template <typename T>
void Queue<T>::push(T item) {
    if (size == capacity) {
        Serial.println("[QUEUE] Queue is full, cannot add item");
        return;
    }
    rear = (rear + 1) % capacity;
    array[rear] = item;
    size++;
}

template <typename T>
T Queue<T>::pop() {
    if (isEmpty()) {
        Serial.println("[QUEUE] Queue is empty, cannot pop item");
        return T(); // Return default value of T
    }
    T item = array[front];
    front = (front + 1) % capacity;
    size--;
    return item;
}

template <typename T>
bool Queue<T>::isEmpty() {
    return size == 0;
}

template <typename T>
int Queue<T>::number_of_elements() {
    return size;
}