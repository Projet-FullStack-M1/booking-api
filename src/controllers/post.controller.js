const prisma = require("../../prisma/prisma");

// Récupérer tous les posts
exports.getPosts = async (req, res) => {
  const query = req.query; // Récupère les paramètres de la requête
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000,
        },
      }, // Cherche tous les posts avec les paramètres de la requête
    }); // Récupère tous les posts
    res.status(200).json(posts); // Envoie les posts avec un statut 200
  } catch (err) {
    console.log(err); // Affiche l'erreur dans la console
    res.status(500).json({ message: "Failed to get posts" }); // Envoie un message d'erreur avec un statut 500
  }
};

// Récupérer un post par ID
exports.getPost = async (req, res) => {
  const id = req.params.id; // Récupère l'ID du post à partir des paramètres de la requête
  try {
    const post = await prisma.post.findUnique({
      where: { id }, // Cherche le post par ID
      include: {
        postDetail: true, // Inclut les détails du post
        user: {
          select: {
            username: true, // Sélectionne le nom d'utilisateur de l'auteur du post
            avatar: true, // Sélectionne l'avatar de l'auteur du post
          },
        },
      },
    });
    res.status(200).json(post); // Envoie le post trouvé avec un statut 200
  } catch (err) {
    console.log(err); // Affiche l'erreur dans la console
    res.status(500).json({ message: "Failed to get post" }); // Envoie un message d'erreur avec un statut 500
  }
};

// Ajouter un nouveau post
exports.addPost = async (req, res) => {
  const body = req.body; // Récupère les données du post à partir du corps de la requête
  const tokenUserId = req.userId; // Récupère l'ID de l'utilisateur à partir du token (authentification)

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData, // Ajoute les données du post
        userId: tokenUserId, // Associe le post à l'utilisateur authentifié
        postDetail: {
          create: {
            ...body.postDetail, // Ajoute les détails du post
          },
        },
      },
    });
    res.status(200).json(newPost); // Envoie le nouveau post créé avec un statut 200
  } catch (err) {
    console.log(err); // Affiche l'erreur dans la console
    res.status(500).json({ message: "Failed to create post" }); // Envoie un message d'erreur avec un statut 500
  }
};

// Mettre à jour un post
exports.updatePost = async (req, res) => {
  try {
    // Code de mise à jour à ajouter ici
    res.status(200).json(); // Envoie une réponse avec un statut 200 (à compléter)
  } catch (err) {
    console.log(err); // Affiche l'erreur dans la console
    res.status(500).json({ message: "Failed to update post" }); // Envoie un message d'erreur avec un statut 500
  }
};

// Supprimer un post
exports.deletePost = async (req, res) => {
  const id = req.params.id; // Récupère l'ID du post à partir des paramètres de la requête
  const tokenUserId = req.userId; // Récupère l'ID de l'utilisateur à partir du token (authentification)
  try {
    const post = await prisma.post.findUnique({
      where: { id }, // Cherche le post par ID
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" }); // Vérifie si l'utilisateur est autorisé à supprimer ce post
    }

    await prisma.post.delete({
      where: { id }, // Supprime le post par ID
    });
    res.status(200).json({ message: "Post deleted successfully" }); // Envoie un message de succès avec un statut 200
  } catch (err) {
    console.log(err); // Affiche l'erreur dans la console
    res.status(500).json({ message: "Failed to delete post" }); // Envoie un message d'erreur avec un statut 500
  }
};
