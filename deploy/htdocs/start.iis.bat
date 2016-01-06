@ECHO OFF

SET iisexpress="%ProgramFiles%\IIS Express\iisexpress.exe"
SET iisexpressx86="%ProgramFiles(x86)%\IIS Express\iisexpress.exe"
SET iis=""

ECHO.
ECHO ###############################################################################
ECHO # MediaMonks Automatic IIS Express starter                                    #
ECHO #-----------------------------------------------------------------------------#
ECHO #                                                                             #

IF EXIST %iisexpress% (
	ECHO # %iisexpress% detected!                     #
	SET iis=%iisexpress%
) ELSE ( 
	IF EXIST %iisexpressx86% (
		ECHO # %iisexpressx86% detected!               #
		SET iis=%iisexpressx86%
	) ELSE (
		ECHO # COMPUTER SAYS NO! [Can't locate IIS Express]                                #
	)
)
IF NOT %iis%=="" (
	ECHO #                                                                             #
	ECHO # Starting website                                                            #
	ECHO #                                                                             #
	ECHO ###############################################################################
	ECHO.
	START http://localhost:8264
	%iis% /path:%CD% /trace:i /port:8264
	
) ELSE (
	ECHO #                                                                             #
	ECHO # Exiting                                                                     #
	ECHO #                                                                             #
	ECHO ###############################################################################
	EXIT /B
)