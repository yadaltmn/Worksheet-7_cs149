#include "apue.h"

static void	sig_usr(int);	/* one handler for both signals */

int
main(void)
{
	if (signal(SIGUSR1, sig_usr) == SIG_ERR)
		err_sys("can't catch SIGUSR1");
	if (signal(SIGUSR2, sig_usr) == SIG_ERR)
		err_sys("can't catch SIGUSR2");
	if (signal(SIGCONT, sig_usr) == SIG_ERR)
		err_sys("can't catch SIGCONT");
	for ( ; ; )
		pause();
}

static void
sig_usr(int signo)		/* argument is signal number */
{
	if (signo == SIGUSR1)
		write(STDOUT_FILENO, "received SIGUSR1\n", 17);
	else if (signo == SIGUSR2)
		write(STDOUT_FILENO, "received SIGUSR2\n", 17);
	else if (signo == SIGCONT)
		write(STDOUT_FILENO, "received SIGCONT\n", 17);
	else
		err_dump("received signal %d\n", signo);
}
