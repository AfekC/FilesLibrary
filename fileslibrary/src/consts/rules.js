export default {
    nameRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => (value || "").length >= 2 || "Min 2 characters",
        (value) => {
            const pattern = /^[a-zA-Z]+$/;
            return pattern.test(value) || "Invalid name.";
        },
    ],
    userNameRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => (value || "").length >= 2 || "Min 2 characters",
        (value) => {
            const pattern = /^[a-zA-Z0-9]+$/;
            return pattern.test(value) || "Invalid userName.";
        },
    ],
    passwordRules: [
        (value) => !!value || "Required.",
        (value) => (value || "").length <= 20 || "Max 20 characters",
        (value) => (value || "").length >= 2 || "Min 2 characters",
        (value) => {
            const pattern = /^(?=.*[\d])(?=.*[a-z])[\w!@#$%^&*]{6,30}$/;
            return pattern.test(value) || "Invalid password.";
        },
    ],
}