# YathraGo - Travel Companion Finder

![YathraGo Logo](./public/Primary.png)

## Description

YathraGo is a modern travel companion finder application built with Next.js that connects travelers around the world. The platform allows users to find travel buddies for their adventures, discover destinations, and chat in real-time with potential travel companions. 

With YathraGo, travelers can:
- Create profiles highlighting their travel interests and destinations
- Search and discover fellow travelers going to the same places
- Connect with travel companions through real-time messaging
- Explore destination recommendations and travel tips
- Share experiences and stories with the community

## Features

- **User Authentication**: Secure login and registration system
- **Real-time Chat**: Instant messaging with other travelers
- **Travel Discovery**: Find destinations and travel companions
- **Profile Management**: Personalize your travel profile
- **Search Functionality**: Find travelers based on location and interests
- **Interactive UI**: Modern, responsive design with engaging animations

## Tech Stack & Dependencies

| Package | Version | Purpose |
|--------|---------|---------|
| [Next.js](https://nextjs.org/) | 14.2.7 | React-based framework for building the web application |
| [React](https://reactjs.org/) | ^18 | JavaScript library for building user interfaces |
| [Mongoose](https://mongoosejs.com/) | ^8.6.0 | MongoDB object modeling for Node.js |
| [MongoDB](https://www.mongodb.com/) | ^6.8.0 | NoSQL database for storing user and travel data |
| [NextAuth.js](https://next-auth.js.org/) | ^4.24.7 | Authentication solution for Next.js applications |
| [Socket.io](https://socket.io/) | ^4.8.3 | Real-time bidirectional event-based communication |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4.1 | Utility-first CSS framework for styling |
| [React Hook Form](https://react-hook-form.com/) | ^7.53.0 | Performant, flexible forms with easy validation |
| [React Hot Toast](https://react-hot-toast.com/) | ^2.4.1 | Animated toast notifications |
| [React Icons](https://react-icons.github.io/react-icons/) | ^5.3.0 | Popular icon sets as React components |
| [Bcryptjs](https://www.npmjs.com/package/bcryptjs) | ^2.4.3 | Password hashing library |
| [Dotenv](https://www.npmjs.com/package/dotenv) | ^16.4.5 | Environment variable management |
| [Pusher](https://pusher.com/) | ^5.2.0 | Real-time communication platform |
| [Cloudinary](https://cloudinary.com/) | ^6.11.0 | Media management and delivery service |
| [Groq SDK](https://www.groq.com/) | ^0.7.0 | API client for AI-powered services |

## How It Works

### Frontend
- Built with Next.js 14 using the App Router
- Client-side rendering with React hooks for state management
- Tailwind CSS for responsive, mobile-first design
- Interactive UI with hover effects and animations
- Real-time communication using Socket.io

### Backend
- RESTful API routes for handling data operations
- MongoDB database with Mongoose ODM for data modeling
- NextAuth.js for secure user authentication
- Socket.io for real-time messaging functionality
- Cloudinary integration for media handling

### Authentication
- Secure credential-based login system
- Password hashing using bcryptjs
- JWT tokens for session management
- Protected routes for authenticated users only

### Database Structure
- **User Model**: Stores user profiles, travel preferences, and authentication details
- **Chat Model**: Manages conversations between users
- **Message Model**: Handles individual messages in chats
- **Destination Model**: Stores travel destination information and recommendations

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd travel-companion
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI_OLD=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

4. Run the development server:
```bash
npm run dev
```

5. Open your browser to [http://localhost:3000](http://localhost:3000) to view the application

## Usage

1. **Register**: Create an account to access all features
2. **Complete Profile**: Add travel interests, destinations, and personal information
3. **Discover**: Search for travelers based on location, interests, or travel dates
4. **Connect**: Send messages to potential travel companions
5. **Plan**: Coordinate travel plans with your new connections

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── (auth)/          # Authentication pages
│   ├── api/             # API routes
│   ├── chatrooms/       # Chat room pages
│   ├── chats/           # Individual chat pages
│   ├── discover/        # Discover travelers page
│   ├── profile/         # User profile page
│   └── ...              # Other pages
├── context/             # React Context providers
├── models/              # Mongoose models
├── mongodb/             # Database connection
└── ui/                  # Reusable UI components
    ├── atoms/           # Small UI components
    ├── molecules/       # Medium UI components
    ├── organisms/       # Large UI components
    └── templates/       # Page templates
```

## API Endpoints

- `POST /api/auth/register` - Register new users
- `POST /api/auth/[...nextauth]` - Handle authentication
- `GET/POST /api/chatrooms` - Manage chat rooms
- `GET/POST /api/chats` - Handle chat operations
- `GET /api/users` - Fetch user data
- `GET /api/users/searchOther` - Search for other users
- `GET /api/destinations` - Get travel destinations
- `GET /api/socket` - Real-time socket connection

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the excellent framework
- MongoDB for the flexible database solution
- All the open-source contributors whose packages made this project possible