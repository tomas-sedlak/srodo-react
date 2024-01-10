var router = require('express').Router();
var mongoose = require('mongoose');
var Post = require("../models/post");
var Subject = require("../models/subject");
var Comment = require("../models/comment");
var User = require("../models/user");

const subjects = [
    {
        label: "Matematika",
        link: "/",
        leftSection: "📈"
    },
    {
        label: "Informatika",
        link: "/",
        leftSection: "💻"
    },
    {
        label: "Jazyky",
        link: "/",
        leftSection: "💬"
    },
    {
        label: "Biológia",
        link: "/",
        leftSection: "🧬"
    },
    {
        label: "Chémia",
        link: "/",
        leftSection: "🧪"
    },
    {
        label: "Fyzika",
        link: "/",
        leftSection: "⚡"
    },
    {
        label: "Geografia",
        link: "/",
        leftSection: "🌍"
    },
    {
        label: "Dejepis",
        link: "/",
        leftSection: "⚔️"
    },
    {
        label: "Iné",
        link: "/",
        leftSection: "📓"
    }
]

router.get('/', function (req, res, next) {
    const adminId = new mongoose.mongo.ObjectId();

    User.create({
        _id: adminId,
        username: "admin",
        displayName: "This is my name",
        profilePicture: "https://wallpapers-clan.com/wp-content/uploads/2022/05/meme-pfp-13.jpg"
    })

    Comment.create({
        author: adminId,
        content: "This is an amazing article :)",
    })

    Post.create({
        coverImage: "https://images.pexels.com/photos/19371512/pexels-photo-19371512/free-photo-of-green-rice-fields.jpeg?w=600",
        title: "Amazing post",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed nunc porttitor dolor lobortis placerat nec sed purus. Praesent ac malesuada ante. Integer turpis lorem, mattis fringilla suscipit non, lacinia vitae purus. Morbi at arcu congue, aliquet felis et, eleifend ipsum. Vivamus at posuere neque. Curabitur diam risus, vulputate vel lacinia a, posuere non ex. Suspendisse felis ex, euismod a arcu quis, euismod bibendum sem. In at velit pretium, iaculis orci vitae, ultricies ligula. Vivamus eu ligula orci. Fusce varius vel augue ut rhoncus. Vestibulum condimentum lorem mollis sapien accumsan facilisis. Fusce laoreet convallis diam ac commodo. Phasellus rhoncus, massa in malesuada fermentum, nisi diam mattis ipsum, nec vulputate justo lacus dictum urna. Praesent congue non mauris et mollis.",
        author: adminId
    })

    Post.create({
        coverImage: "https://images.pexels.com/photos/19453408/pexels-photo-19453408/free-photo-of-bryggen-is-a-historic-harbour-district-in-bergen.jpeg?w=600",
        title: "Another amazing post",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed nunc porttitor dolor lobortis placerat nec sed purus. Praesent ac malesuada ante. Integer turpis lorem, mattis fringilla suscipit non, lacinia vitae purus. Morbi at arcu congue, aliquet felis et, eleifend ipsum. Vivamus at posuere neque. Curabitur diam risus, vulputate vel lacinia a, posuere non ex. Suspendisse felis ex, euismod a arcu quis, euismod bibendum sem. In at velit pretium, iaculis orci vitae, ultricies ligula. Vivamus eu ligula orci. Fusce varius vel augue ut rhoncus. Vestibulum condimentum lorem mollis sapien accumsan facilisis. Fusce laoreet convallis diam ac commodo. Phasellus rhoncus, massa in malesuada fermentum, nisi diam mattis ipsum, nec vulputate justo lacus dictum urna. Praesent congue non mauris et mollis.",
        author: adminId
    })

    Post.create({
        coverImage: "https://images.pexels.com/photos/19311000/pexels-photo-19311000/free-photo-of-buses-in-downtown.jpeg?w=600",
        title: "Last post",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque sed nunc porttitor dolor lobortis placerat nec sed purus. Praesent ac malesuada ante. Integer turpis lorem, mattis fringilla suscipit non, lacinia vitae purus. Morbi at arcu congue, aliquet felis et, eleifend ipsum. Vivamus at posuere neque. Curabitur diam risus, vulputate vel lacinia a, posuere non ex. Suspendisse felis ex, euismod a arcu quis, euismod bibendum sem. In at velit pretium, iaculis orci vitae, ultricies ligula. Vivamus eu ligula orci. Fusce varius vel augue ut rhoncus. Vestibulum condimentum lorem mollis sapien accumsan facilisis. Fusce laoreet convallis diam ac commodo. Phasellus rhoncus, massa in malesuada fermentum, nisi diam mattis ipsum, nec vulputate justo lacus dictum urna. Praesent congue non mauris et mollis.",
        author: adminId
    })

    subjects.map((subject, index) => {
        Subject.create({
            index: index,
            label: subject.label,
            emoji: subject.leftSection,
            url: subject.link
        })
    })

    res.send("'Dummy' hodnoty v databaze boli pridane")
});

module.exports = router;
