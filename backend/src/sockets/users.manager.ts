const usersInRoom: Record<string, Record<string, string>> = {}


// Add user to room
export const addUser = (room: string, socketId: string, username: string) => {
  // If room does not exist, create room
  if (!usersInRoom[room]) {
    usersInRoom[room] = {}
  }

  // Add user to room
  usersInRoom[room][socketId] = username
}

// Remove user from room
export const removeUser = (room: string, socketId: string) => {
  const roomUsers = usersInRoom[room]
  if (!roomUsers) return // room does not exist

  // Remove user from room
  delete roomUsers[socketId]

  // if room is empty, remove the room
  if (Object.keys(roomUsers).length === 0) {
    delete usersInRoom[room]
  }
}

// Get all users from specific room
export const getUsersInRoom = (room: string) => {
  const roomUsers = usersInRoom[room]
  return roomUsers ? Object.values(roomUsers): []
}

// Get username from room
export const getUsername = (room: string, socketId: string) => {
  return usersInRoom[room]?.[socketId]
}