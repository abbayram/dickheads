// Express.js Backend-Routen

// Admin-Registrierung
app.post('/api/admin/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Überprüfen, ob Admin bereits existiert
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { username }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Benutzer oder E-Mail bereits vergeben' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen Admin erstellen
        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword
        });

        await newAdmin.save();
        
        res.status(201).json({ message: 'Admin erfolgreich registriert' });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// Admin-Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Admin suchen
        const admin = await Admin.findOne({ 
            $or: [{ email: username }, { username }] 
        });

        if (!admin) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        // Passwort überprüfen
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
        }

        // JWT-Token erstellen
        const token = jwt.sign(
            { id: admin._id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            message: 'Login erfolgreich',
            token,
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// Middleware für Authentifizierung
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.adminData = { id: decodedToken.id, username: decodedToken.username };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentifizierung fehlgeschlagen' });
    }
};

// Produkt erstellen
app.post('/api/products', authMiddleware, upload.array('images', 5), async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const slug = slugify(name, { lower: true });

        // Überprüfen, ob der Slug bereits existiert
        const existingProduct = await Product.findOne({ slug });
        if (existingProduct) {
            return res.status(400).json({ message: 'Ein Produkt mit diesem Namen existiert bereits' });
        }

        // Bilder-Pfade speichern
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        // Neues Produkt erstellen
        const newProduct = new Product({
            name,
            description,
            price,
            images: imageUrls,
            slug,
            createdBy: req.adminData.id
        });

        await newProduct.save();
        
        // Produktseite erstellen
        await createProductPage(newProduct);
        
        res.status(201).json({ 
            message: 'Produkt erfolgreich erstellt',
            product: newProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// Alle Produkte abrufen
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});

// Einzelnes Produkt abrufen
app.get('/api/products/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        
        if (!product) {
            return res.status(404).json({ message: 'Produkt nicht gefunden' });
        }
        
        res.status(200).json({ product });
    } catch (error) {
        res.status(500).json({ message: 'Serverfehler', error: error.message });
    }
});
