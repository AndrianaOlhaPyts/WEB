const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Масив для збереження постів
let posts = [];
let postIdCounter = 1; // Додано лічильник для унікальних ідентифікаторів

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/new', (req, res) => {
    // Отримання даних з форми
    const { title, description, author } = req.body;
    // Створення нового поста і додавання його в масив
    const newPost = { id: postIdCounter++, title, description, author }; // Додано унікальний ідентифікатор
    posts.push(newPost);
    res.redirect('/');
});

// Маршрут для відображення форми редагування поста
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postToEdit = posts.find(post => post.id === postId);
    res.render('edit', { post: postToEdit });
});

// Маршрут для збереження відредагованого поста
app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, description, author } = req.body;

    // Знайдіть індекс поста у масиві
    const postIndex = posts.findIndex(post => post.id === postId);

    // Оновіть відповідний пост
    if (postIndex !== -1) {
        posts[postIndex] = { id: postId, title, description, author };
        res.redirect('/');
    } else {
        // Handle case where post with given ID is not found
        res.status(404).send('Post not found');
    }
});

// Маршрут для видалення поста
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);

    // Відфільтруйте пости, залишивши той, який ви хочете видалити
    posts = posts.filter(post => post.id !== postId);

    res.redirect('/');
});

app.get('/post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postToShow = posts.find(post => post.id === postId);
    res.render('post', { post: postToShow });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
