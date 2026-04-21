"use client";

import { useRef, useActionState } from "react";
import { createCategory } from "@/services/categories-services";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FaSave } from "react-icons/fa";
import { fonts } from "@/utils/fonts";

interface ConfirmationDialogProps {
    buttonText?: string;
    message: string;
    title: string;
    isPending?: boolean;
    handleConfirm?: () => void;
    classNameButton?: string;
}

export default function Confirmation({...props}: ConfirmationDialogProps) {

    return (
        <div className="flex justify-end gap-4">
            {/* O AlertDialog envolve o botão de gatilho */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        type="button" // IMPORTANTE: Não é submit aqui
                        className={props.classNameButton || "bg-zinc-900 text-white"}
                        disabled={props.isPending}
                    >
                        <FaSave className="mr-2" /> 
                        {props.isPending ? "Salvando..." : props.buttonText || "Salvar"}
                    </Button>
                </AlertDialogTrigger>
                
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={`${fonts.oswald.className}`}>{props.title}</AlertDialogTitle>
                        <AlertDialogDescription className={`${fonts.oswald.className} text-[1rem] al`}>
                            {props.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={`bg-white hover:bg-amber-50 text-black h-10 px-4 ${fonts.oswald.className}`} >Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={props.handleConfirm}
                            className={`bg-red-600 hover:bg-red-700 text-white h-10 px-4 ${fonts.oswald.className}`}
                        >
                            Confirmar e Salvar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}