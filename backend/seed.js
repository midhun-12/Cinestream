const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Movie = require('./models/Movie');
const Theater = require('./models/Theater');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');

const genericBanner = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80";

const moviesData = [
  {
    title: "Inception",
    description: "Cobb, a skilled thief who steals secrets from deep within the subconscious during the dream state, is offered a chance at redemption: planting an idea into a target's mind.",
    poster: "https://image.tmdb.org/t/p/w500/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&mute=1",
    genre: "Action / Sci-Fi / Thriller",
    language: "English", format: "IMAX", duration: 148,
    cast: [
      { name: "Leonardo DiCaprio", image: "https://image.tmdb.org/t/p/w200/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { name: "Joseph Gordon-Levitt", image: "https://image.tmdb.org/t/p/w200/z2FA8js799xqtfiFjBTicFYdfk.jpg" },
      { name: "Ken Watanabe", image: "https://image.tmdb.org/t/p/w200/psAXOYp9SBOXvg6AXzARDedNQ9P.jpg" }
    ]
  },
  {
    title: "The Dark Knight",
    description: "Batman, Gordon and Harvey Dent are forced to deal with the chaos unleashed by an anarchist mastermind known only as the Joker.",
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&mute=1",
    genre: "Action / Crime / Drama",
    language: "English", format: "IMAX", duration: 152,
    cast: [
      { name: "Christian Bale", image: "https://image.tmdb.org/t/p/w200/7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg" },
      { name: "Heath Ledger", image: "https://image.tmdb.org/t/p/w200/AdWKVqyWpkYSfKE5Gb2qn8JzHni.jpg" },
      { name: "Aaron Eckhart", image: "https://image.tmdb.org/t/p/w200/u5JjnRMr9zKEVvOP7k3F6gdcwT6.jpg" }
    ]
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    poster: "https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/vKQi3bBA1y8?autoplay=1&mute=1",
    genre: "Action / Sci-Fi",
    language: "English", format: "Dolby Cinema", duration: 136,
    cast: [
      { name: "Keanu Reeves", image: "https://image.tmdb.org/t/p/w200/8RZLOyYGsoRe9p44q3xin9QkMHv.jpg" },
      { name: "Laurence Fishburne", image: "https://image.tmdb.org/t/p/w200/2GbXERENPpl5MmlqOLlPVaVtifD.jpg" },
      { name: "Carrie-Anne Moss", image: "https://image.tmdb.org/t/p/w200/xD4jTA3KmVp5Rq3aHcymL9DUGjD.jpg" }
    ]
  },
  {
    title: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
    poster: "https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/TcMBFSGVi1c?autoplay=1&mute=1",
    genre: "Action / Adventure / Drama",
    language: "English", format: "IMAX 3D", duration: 181,
    cast: [
      { name: "Robert Downey Jr.", image: "https://image.tmdb.org/t/p/w200/5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg" },
      { name: "Chris Evans", image: "https://image.tmdb.org/t/p/w200/3bOGNsHlrswhyW79uvIHH1V43JI.jpg" },
      { name: "Mark Ruffalo", image: "https://image.tmdb.org/t/p/w200/5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg" }
    ]
  },
  {
    title: "Avatar",
    description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
    poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/5PSNL1qE6VY?autoplay=1&mute=1",
    genre: "Action / Adventure / Fantasy",
    language: "English", format: "IMAX 3D", duration: 162,
    cast: [
      { name: "Sam Worthington", image: "https://image.tmdb.org/t/p/w200/mflBcox36s9ZPbsZPVOuhf6axaJ.jpg" },
      { name: "Zoe Saldana", image: "https://image.tmdb.org/t/p/w200/iOVbUH20il632nj2v01NCtYYeSg.jpg" },
      { name: "Sigourney Weaver", image: "https://image.tmdb.org/t/p/w200/wTSnfktNBLd6kwQxgvkqYw6vEon.jpg" }
    ]
  },
  {
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1",
    genre: "Adventure / Drama / Sci-Fi",
    language: "English", format: "IMAX 70mm", duration: 169,
    cast: [
      { name: "Matthew McConaughey", image: "https://image.tmdb.org/t/p/w200/lCySuYjhXix3FzQdS4oceDDrXKI.jpg" },
      { name: "Anne Hathaway", image: "https://image.tmdb.org/t/p/w200/s6tflSD20MGz04ZR2R1lZvhmC4Y.jpg" },
      { name: "Michael Caine", image: "https://image.tmdb.org/t/p/w200/bVZRMlpjTAO2pJK6v90buFgVbSW.jpg" }
    ]
  },
  {
    title: "Titanic",
    description: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    poster: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/kVrqfYjkTdQ?autoplay=1&mute=1",
    genre: "Drama / Romance",
    language: "English", format: "3D", duration: 194,
    cast: [
      { name: "Leonardo DiCaprio", image: "https://image.tmdb.org/t/p/w200/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg" },
      { name: "Kate Winslet", image: "https://image.tmdb.org/t/p/w200/6qNnMsKtKz9si5rabpUEG85UfHp.jpg" },
      { name: "Billy Zane", image: "https://image.tmdb.org/t/p/w200/wr4fuwLzQvW1G0MS7cmQ3ObFjvL.jpg" }
    ]
  },
  {
    title: "Jurassic Park",
    description: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
    poster: "https://image.tmdb.org/t/p/w500/maFjKnJ62hDQ9E66dKqDZgbUy0H.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/bx46tthKXmc?autoplay=1&mute=1",
    genre: "Action / Adventure / Sci-Fi",
    language: "English", format: "Standard", duration: 127,
    cast: [
      { name: "Sam Neill", image: "https://image.tmdb.org/t/p/w200/iIfuxalf37xUayuGyK0zG7z6WEZ.jpg" },
      { name: "Laura Dern", image: "https://image.tmdb.org/t/p/w200/gB9PnGEvxKg33OSlcqptQwTBwPE.jpg" },
      { name: "Jeff Goldblum", image: "https://image.tmdb.org/t/p/w200/kcyEPgYtBP5Pm6LLeLGfXKjYovL.jpg" }
    ]
  },
  {
    title: "Gladiator",
    description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    poster: "https://image.tmdb.org/t/p/w500/wN2xWp1eIwCKOD0BHTcErTBv1Uq.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/UV3hL7H-ZzY?autoplay=1&mute=1",
    genre: "Action / Adventure / Drama",
    language: "English", format: "Standard", duration: 155,
    cast: [
      { name: "Russell Crowe", image: "https://image.tmdb.org/t/p/w200/uxiXuVH4vNWrKlJMVVPG1sxAJFe.jpg" },
      { name: "Joaquin Phoenix", image: "https://image.tmdb.org/t/p/w200/u38k3hQBDwNX0VA22aQceDp9Iyv.jpg" },
      { name: "Connie Nielsen", image: "https://image.tmdb.org/t/p/w200/gSQ3O3PJ6ly6nT63joOtfZyscFP.jpg" }
    ]
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    poster: "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg",
    bannerImage: genericBanner,
    trailerUrl: "https://www.youtube.com/embed/V75dMMIW2B4?autoplay=1&mute=1",
    genre: "Action / Adventure / Drama",
    language: "English", format: "Standard", duration: 178,
    cast: [
      { name: "Elijah Wood", image: "https://image.tmdb.org/t/p/w200/ayARmqAe9Aab1zg6FjJG0u9MEBo.jpg" },
      { name: "Ian McKellen", image: "https://image.tmdb.org/t/p/w200/coWjgMEYJjk2OrNddlXCBm8EIr3.jpg" },
      { name: "Viggo Mortensen", image: "https://image.tmdb.org/t/p/w200/vH5gVSpHAMhDaFWfh0Q7BG61O1y.jpg" }
    ]
  }
];

const theatersData = [
  { name: "PVR Cinemas", city: "Hyderabad", locality: "Jubilee Hills" },
  { name: "AMB Cinemas", city: "Hyderabad", locality: "Gachibowli" },
  { name: "Prasads IMAX", city: "Hyderabad", locality: "Necklace Road" },
  { name: "PVP Square INOX", city: "Vijayawada", locality: "MG Road" },
  { name: "Cinepolis", city: "Vijayawada", locality: "Patamata" },
  { name: "Hollywood Bollywood", city: "Guntur", locality: "Lakshmipuram" },
  { name: "Harihar Mahal", city: "Guntur", locality: "Arundelpet" },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Wiping existing data...');
    
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Showtime.deleteMany({});
    await Booking.deleteMany({});

    const salt = await bcrypt.genSalt(10);

    // Regular demo user
    const hashedPassword = await bcrypt.hash('password123', salt);
    await User.create({ name: 'Demo User', email: 'demo@example.com', password: hashedPassword });

    // Admin user
    const adminPassword = await bcrypt.hash('admin123', salt);
    await User.create({ name: 'Admin', email: 'admin@cinestream.com', password: adminPassword, isAdmin: true });

    const movies = await Movie.insertMany(moviesData);
    const theaters = await Theater.insertMany(theatersData);

    const showtimes = [];
    const times = ["10:00 AM", "01:30 PM", "05:00 PM", "08:45 PM"];
    
    for (let i = 0; i < 3; i++) {
        let d = new Date();
        d.setDate(d.getDate() + i);
        let dateStr = d.toISOString().split('T')[0]; 

        for (const theater of theaters) {
            const selectedMovies = movies.sort(() => 0.5 - Math.random()).slice(0, 5);
            for (const movie of selectedMovies) {
                const movieTimes = [times[Math.floor(Math.random() * 2)], times[2 + Math.floor(Math.random() * 2)]];
                for(const timeStr of movieTimes) {
                    showtimes.push({
                        movie: movie._id,
                        theater: theater._id,
                        date: dateStr,
                        time: timeStr,
                        price: 150 + Math.floor(Math.random() * 100) 
                    });
                }
            }
        }
    }
    await Showtime.insertMany(showtimes);

    console.log('✅ Database seeded! Admin: admin@cinestream.com / admin123');
    process.exit();
  })
  .catch((err) => {
    console.error('Error seeding data:', err);
    process.exit(1);
  });
