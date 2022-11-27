import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Container,
    Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { trpc } from '../../../utils/trpc';

export function LoginBody() {

    const router = useRouter()

    const form = useForm({
        initialValues: {
            email: "boy@ordersort.com",
            password: 'password',
        }
    })

    const {
        mutate: login,
        isLoading,
    } = trpc.auth.login.useMutation({
        onSuccess: () => {
            router.push('/')
        },
        onError: (error) => {
            showNotification({
                title: 'Error',
                message: error.message,
            })
        }
    })

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                Welcome
            </Title>

            <Paper withBorder={true} shadow="md" p={30} mt={30} radius="md">
                <form
                    onSubmit={form.onSubmit((values) => {
                        login(values)
                    })}
                >
                    <TextInput label="Email" placeholder="you@mantine.dev" required={true}
                        {...form.getInputProps('email')}
                    />
                    <PasswordInput label="Password" placeholder="Your password" required={true} mt="md"
                        {...form.getInputProps('password')}
                    />
                    <Button color="teal" fullWidth={true} mt="xl"
                        loading={isLoading}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}