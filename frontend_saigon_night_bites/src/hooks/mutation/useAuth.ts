import { useMutation } from "@tanstack/react-query";
import { authService } from "../../services";
import { TLogin, TRegister } from "../../schemas";
export const useLogin = () => {
    return useMutation({
        mutationFn: async (payload: TLogin) => authService.login(payload)
    })
};
export const useRegister = () => {
    return useMutation({
        mutationFn: async (payload: TRegister) => authService.register(payload)
    })
};