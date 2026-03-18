#include "apue.h"

int main(void)
{
	pid_t	pid;

	printf("Before fork PID is: %ld\n", (long)getpid());

	if ((pid = fork()) < 0)
		err_sys("fork error");
	else if (pid != 0) {
		printf("Parent PID is: %ld\n", (long)getpid());		/* parent */
		sleep(2);
		exit(2);				/* terminate with exit status 2 */
	}

	if ((pid = fork()) < 0)
		err_sys("fork error");
	else if (pid != 0) {		
		printf("First Child PID is: %ld\n", (long)getpid());	/* first child */
		sleep(4);
		abort();				/* terminate with core dump */
	}

	if ((pid = fork()) < 0)
		err_sys("fork error");
	else if (pid != 0) {	
		printf("Second Child PID is: %ld\n", (long)getpid());	/* second child */
		execl("/bin/dd", "dd", "if=/etc/passwd", "of=/dev/null", NULL);
		exit(7);				/* shouldn't get here */
	}

	if ((pid = fork()) < 0)
		err_sys("fork error");
	else if (pid != 0) {	
		printf("Third Child PID is: %ld\n", (long)getpid());	/* third child */
		sleep(8);
		exit(0);				/* normal exit */
	}
	
	printf("Fourth Child PID is: %ld\n", (long)getpid());	/* fourth child */
	sleep(6);					
	kill(getpid(), SIGKILL);	/* terminate w/signal, no core dump */
	exit(6);    /* shouldn't get here */
}