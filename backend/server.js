const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan')
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 5001;
const db = require('./src/models/index');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/outputs', express.static(path.join(__dirname, 'src', 'outputs')));

const apiRouter = require('./src/routes/index');

app.use(cors());
app.use(morgan('dev'))

app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.send('Hello world')
})

const { initMeilisearch } = require('./src/meilisearch/meilisearch.init');

(async () => {
    try {
        await initMeilisearch();
        console.log('Meilisearch initialized successfully');
    } catch (err) {
        console.warn('Meilisearch not available, continuing without it:', err.message);
    } finally {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
})();
