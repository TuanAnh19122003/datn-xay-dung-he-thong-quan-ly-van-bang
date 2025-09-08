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
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (err) {
        console.error('❌ Server start failed due to Meilisearch error:', err);
        process.exit(1);
    }
})();