const profileReducers = {
    setInitialProfile: (state, action) => {
        state.userId = action.payload.id;
        state.name = action.payload.name;
        state.profileImageUrl = action.payload.url;
        state.role = action.payload.role;
        state.unreadNotifications = action.payload.unread_notification;
    },
    removeProfileState: (state, action) => {
        state.userId = null;
        state.name = null;
        state.profileImageUrl = null;
        state.role = null;
        state.unreadNotifications = null;
    },
    setNewProfileImage: (state, action) => {
        state.profileImageUrl = action;
    },
    updateProfile: (state, action) => {
        state.name = action.payload.name;
        const user = JSON.parse(window.localStorage.getItem("user"));
        user.name = action.payload.name;
        window.localStorage.setItem("user", JSON.stringify(user));
    },
    setUnreadNotification: (state, action) => {
        state.unreadNotifications = action.payload;
    },
    readNotification: (state, action) =>{
        state.unreadNotifications = 0;
    }
};

export default profileReducers;
